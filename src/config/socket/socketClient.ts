// const WebSocket = require('ws');
// const server = new WebSocket.Server({ port: 8080 });

// server.on('connection', (socket) => {
//   console.log('Client connected');

//   // Gửi thông điệp khi nhận được từ một client
//   socket.on('message', (message) => {
//     console.log('Received:', message);
//     // Gửi thông điệp tới tất cả các client
//     server.clients.forEach((client) => {
//       if (client !== socket && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   socket.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// console.log('WebSocket server running on ws://localhost:8080');
