const express = require('express')
const socketio = require('socket.io')

const app = express()
app.use(express.static(__dirname + '/../public'))

const expressServer = app.listen(6969, () => {
    console.info('listening for connections on port 6969')
})
const io = socketio(expressServer)

io.on('connection', (socket, _req) => {
    socket.emit('server-message', { data: 'Hello from the server side' })
    socket.on('message-to-server', (data) => {
        console.info(data)
    })
    socket.join('level-1')
    socket
        .to('level-1')
        .emit('joined', `${socket.id} has joined the level-1 room`)
})

io.of('/admin').on('connection', (socket) => {
    console.log('A client is connected to the `admin` namespace')
    socket.emit('admin-message', {
        data: 'an admin message from the server',
    })
})
