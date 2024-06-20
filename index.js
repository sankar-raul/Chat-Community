const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const path = require('path')
const fs  = require('fs')
const chatCommandBuffers = require('./chatFiles/chatControlls/chatCommands.json')
require('dotenv').config()
const ws = require('ws')
const wss = new ws.Server({server})
const PORT = process.env.PORT || 8080
const createFileIfNotExist = require('./functions/createFileIfNotExists')
const handleChatCommand = require('./functions/handleChatCommand')
createFileIfNotExist('./chatFiles/chat.txt')
let isFileExists = true
let messages = []
const chatCommandsList = Object.keys(chatCommandBuffers)
wss.on('connection', (ws) => {
    // console.log("client connected")
    ws.on('message', (data) => {
        let isItCommand = async () => {
            return new Promise((resolve, reject) => {
        chatCommandsList.forEach(command => {
            if (data.compare(Buffer.from(chatCommandBuffers[command])) === 0) {
                console.log("opppo", command)
                return resolve(handleChatCommand(command))
            }
        })
        resolve(false)
    })
}
    isItCommand().then(cmd => {
        console.log(data.toString())
        if (!cmd) {
        const dataInfo = {msg: data, user: 'user'}
        fs.appendFile(path.join(__dirname, 'chatFiles', 'chat.txt'), JSON.stringify(dataInfo) + '%$ank@r%', (err) => {
            err && console.error(err)
            console.log('saved')
        })
        messages.push(data)
    } else {
        if (cmd == "delete_all_chat") {
        fs.readFile(path.join(__dirname, 'chatFiles', 'notes.txt'), 'utf-8', (err, data) => {
            err && console.error(err)
            let chats
                 chats = data.split('%$ank@r%')
                messages = []
                 chats.forEach(jsonObj => {
                    jsonObj != '' && messages.push(Buffer.from(JSON.parse(jsonObj).msg))
                 })
                })
        } else if (cmd == "delete_previous_msg") {
            messages.length > 6 && messages.pop()
        }
    }
        wss.clients.forEach(client => {
            client.send(data)
        })
    })
    })
    ws.on('close', () => {
        // console.log("client disconnected")
    })
})
wss.on('close', () => {
    // console.log("client disconnected")
})
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    let chats
    // console.log(messages)
    createFileIfNotExist('./chatFiles/chat.txt')
    if (!messages[0]) {
    fs.readFile(path.join(__dirname, 'chatFiles', 'chat.txt'), 'utf-8', (err, data) => {
    err && console.error(err, "dfkdfdfkjdf dfjdnfjdf ")
         chats = data.split('%$ank@r%')
        //  console.log(chats)
         chats.forEach(jsonObj => {
            jsonObj != '' && messages.push(Buffer.from(JSON.parse(jsonObj).msg))
         })
         return res.render('home',{messages})
    })
} else {
    res.render('home',{messages})
}
})
app.get('/health', (req, res) => {
    res.status(200).json("Ok")
})
app.get('/json/chatConfig.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatFiles', 'chatControlls', 'chatCommands.json'))
})
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
