const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const path = require('path')
const fs  = require('fs')
require('dotenv').config()
const ws = require('ws')
const { error } = require('console')
const wss = new ws.Server({server})
const PORT = process.env.PORT || 8080
const createFileIfNotExist = require('./functions/createFileIfNotExists')
createFileIfNotExist('./chatFiles/chat.txt')
let isFileExists = true
const messages = []
wss.on('connection', (ws) => {
    // console.log("client connected")
    ws.on('message', (data) => {
        // console.log(data, "data")
        const dataInfo = {msg: data, user: 'user'}
        fs.appendFile(path.join(__dirname, 'chatFiles', 'chat.txt'), JSON.stringify(dataInfo) + '%$ank@r%', (err) => {
            err && console.error(err)
            // console.log('saved')
        })
        messages.push(data)
        wss.clients.forEach(client => {
            client.send(data)
        });
    })
    ws.on('close', () => {
        // console.log("client disconnected")
    })
})
wss.on('close', () => {
    // console.log("client disconnected")
})
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    let chats
    // console.log(messages)
    if (!messages[0]) {
    fs.readFile(path.join(__dirname, 'chatFiles', 'chat.txt'), 'utf-8', (err, data) => {
    err && console.error(err)
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
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})