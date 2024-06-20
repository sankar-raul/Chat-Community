

const wsServerUrl = location.href.split('//')
const socket = new WebSocket(`${wsServerUrl[0] == 'https:' ? 'wss' : 'ws'}://${wsServerUrl[1]}`)
const text = document.getElementById("textBox")
const messagesSection = document.getElementsByClassName('messages')[0]
const fileReader = new FileReader()
const msgBox = document.getElementsByClassName('messageBox')[0]
const commandsBuffer = {}
let msgs = []
fetch('/json/chatConfig.json').then(commands => {
    return commands.json()
}).then(cmd => {
    commandsBuffer.obj = cmd
    commandsBuffer.keys = Object.keys(cmd)
})
socket.onopen = () => {
    console.log("Web Socket connected")
}
function appendMsg(msg) {
    const chat = document.createElement('div')
    const chats = document.createElement('div')
    const chatContent = document.createElement('li')
    chatContent.innerText = msg
    chat.classList.add('chat')
    chats.classList.add('chats')
    chatContent.classList.add('chat-content')
    chats.appendChild(chatContent)
    chat.appendChild(chats)
    chat.classList.add('userTyped')
    messagesSection.appendChild(chat)
    msgs.push(chat)
    toBottom()
}
fileReader.onload = (e) => {
    console.log(e.target.result)
    const canAppend = () => {
    return new Promise((resolve, reject) => {
        commandsBuffer.keys.forEach(buffer => {
        const decoder = new TextDecoder()
        const unitArray = new Uint8Array(commandsBuffer.obj[buffer])
        if (decoder.decode(unitArray) == e.target.result) {
            if (e.target.result.includes('delete') && !e.target.result.includes('previous')) {
                msgs = []
                const userTypedMsgs = document.getElementsByClassName('userTyped')
                Array.from(userTypedMsgs).forEach(element => {
                    messagesSection.removeChild(element)
                })
                console.log(userTypedMsgs)
                return resolve(false)
            } else if (e.target.result.includes('previous')) {
                const lastElement = messagesSection.lastElementChild
                lastElement.classList.contains('userTyped') && messagesSection.removeChild(lastElement)
                console.log("ok")
                return resolve(false)
            } else {
                console.log("command not implemented")
                return resolve(true)
            }
        }
    })
    resolve(true)
    })
}
canAppend().then(isCan => {
    isCan && appendMsg(e.target.result)
})
}
function toBottom() {
    messagesSection.scroll({
        top: messagesSection.scrollHeight,
        left: 0,
        behavior: 'smooth'
      })
      
}
toBottom()
socket.onmessage = (event) => {
    console.log(event.data)
    fileReader.readAsText(event.data)
}
msgBox.onsubmit = (e) => {
    e.preventDefault()
    text.value.trim() != '' ? sendMessage() : null
}
function sendMessage() {
    socket.send(text.value)
    text.value = ''
}
socket.onclose = () => {
    console.log("Web socket disconnected")
    location.replace(location.href)
}
function scrollStoped() {
    messagesSection.classList.remove('scroll-active')
    messagesSection.classList.add('scroll-not-active')
}
let scrollTimeout;
messagesSection.addEventListener('wheel', () => {
    clearTimeout(scrollTimeout)
    messagesSection.classList.add('scroll-active')
    messagesSection.classList.remove('scroll-not-active')
    scrollTimeout = setTimeout(scrollStoped, 300)
})