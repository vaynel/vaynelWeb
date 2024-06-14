const socketIo = require('socket.io');

const socketConfig = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);  // 메시지를 모든 클라이언트에게 보냄
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

module.exports = socketConfig;
