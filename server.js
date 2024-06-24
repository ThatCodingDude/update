const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`New connection from ${ip}`);

    ws.on('message', (message) => {
        const messageData = JSON.parse(message);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(messageData));
            }
        });
    });

    ws.on('close', () => {
        console.log(`Connection closed from ${ip}`);
    });
});

server.listen(8080, () => {
    console.log('WebSocket server started on port 8080');
});
