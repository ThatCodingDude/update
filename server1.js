const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let users = [];

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`New connection from ${ip}`);

    ws.on('message', (message) => {
        const messageData = JSON.parse(message);
        
        if (messageData.type === 'join') {
            users.push({ name: messageData.name, color: messageData.color, ws: ws });
            updateOnlineUsers();
        } else if (messageData.type === 'chat') {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(messageData));
                }
            });
        }
    });

    ws.on('close', () => {
        users = users.filter(user => user.ws !== ws);
        updateOnlineUsers();
        console.log(`Connection closed from ${ip}`);
    });
});

function updateOnlineUsers() {
    const userNames = users.map(user => ({ name: user.name }));
    const updateMessage = JSON.stringify({ type: 'updateUsers', users: userNames });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(updateMessage);
        }
    });
}

server.listen(8080, () => {
    console.log('WebSocket server started on port 8080');
});
