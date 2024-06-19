const express = require('express');
const http = require('http');
const path = require('path')
const WebSocket = require('ws');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// Express route
const messages = []
app.get('/', (req, res) => {
  res.render('index',{messages: messages})
});
// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
    messages.push(message)
    console.log(message)

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
