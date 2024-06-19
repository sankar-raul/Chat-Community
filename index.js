const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const path = require('path')
const fs  = require('fs')
require('dotenv').config()
const ws = require('ws')
const wss = new ws.Server({server})
const PORT = process.env.PORT || 8080

const messages = ["Hello friends wellcome to group chat an web based app",
     "Chat here with your friends",
     "note - Its a simple group chat app not chat gpt 😅",
     "note - Don't send here anything which can violate Community Standards. If your message goes against our Community Standards, we'll remove it.",
     "This chat web application is developed with ❤️ by Me (Sankar) ..."
    ]

wss.on('connection', (ws) => {
    console.log("client connected")
    ws.on('message', (data) => {
        console.log(data)
        messages.push(data)
        wss.clients.forEach(client => {
            client.send(data)
        });
    })
    ws.on('close', () => {
        console.log("client disconnected")
    })
})
wss.on('close', () => {
    console.log("client disconnected")
})
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home',{messages: messages});
})
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})