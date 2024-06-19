const wsServerUrl = location.href.split('//')
const socket = new WebSocket(`${wsServerUrl[0] == 'https:' ? 'wss' : 'ws'}://${wsServerUrl[1]}`)
const text = document.getElementById("textBox")
const messagesSection = document.getElementsByClassName('messages')[0]
const fileReader = new FileReader()
const msgBox = document.getElementsByClassName('messageBox')[0]
socket.onopen = () => {
    console.log("Web Socket connected")
}
fileReader.onload = (e) => {
    console.log(e.target.result)
    const chat = document.createElement('div')
    const chats = document.createElement('div')
    const chatContent = document.createElement('li')
    chatContent.innerText = e.target.result
    chat.classList.add('chat')
    chats.classList.add('chats')
    chatContent.classList.add('chat-content')
    chats.appendChild(chatContent)
    chat.appendChild(chats)
    messagesSection.appendChild(chat)
    toBottom()
}
function toBottom() {
    messagesSection.scroll({
        top: messagesSection.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
      
}
toBottom()
socket.onmessage = (event) => {
    fileReader.readAsText(event.data)
}
msgBox.onsubmit = (e) => {
    e.preventDefault()
    console.log('ok')
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