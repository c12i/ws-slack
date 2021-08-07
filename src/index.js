const express = require('express')
const socketio = require('socket.io')
const namespaces = require('./data/namespaces')

const app = express()
app.use(express.static(__dirname + '/../public'))

const expressServer = app.listen(6969, () => {
    console.info('listening for connections on `port:6969`')
})
const io = socketio(expressServer)

io.on('connection', (socket, _req) => {
    // build an array to send back with a list of endpoints and image urls
    // note that this data could also be getting fetched from an external source too i.e db
    const nsData = namespaces.map(({ id, img, endpoint }) => ({
        id,
        img,
        endpoint,
    }))

    // send the ns data back to the client
    socket.emit('ns-list', nsData)
})

// loop through each namespace and listen to a connection
namespaces.forEach((ns) => {
    io.of(ns.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has joined ${ns.endpoint} namespace`)
        nsSocket.emit('ns-room-load', ns.rooms)
        nsSocket.on('join-room', (roomData, userCountCallback) => {
            // leave the room the user was in
            const prevRoom = Array.from(nsSocket.rooms.values())[1]
            nsSocket.leave(prevRoom)
            // update socket count on leaving
            updateUserCount(ns, prevRoom, userCountCallback)

            const joinedRoom = ns.rooms.find(
                (room) => room.roomId === roomData.roomId
            )

            // join room and emit message history
            nsSocket.join(roomData.roomTitle)
            nsSocket.emit('history-catch-up', joinedRoom.history)
            // send number of connected sockets
            updateUserCount(ns, roomData.roomTitle, userCountCallback)
        })

        nsSocket.on('new-message-to-server', (message) => {
            const roomToSend = Array.from(nsSocket.rooms.values())[1]
            const roomObj = ns.rooms.find(
                (room) => room.roomTitle === roomToSend
            )
            roomObj.addMessage(message)
            io.of(ns.endpoint)
                .in(roomToSend)
                .emit(`message-to-clients`, message)
        })

        nsSocket.on('disconnect', () => {
            const roomToLeave = Array.from(nsSocket.rooms.values())[1]
            nsSocket.leave(roomToLeave)
            io.of(ns.endpoint)
                .in(roomToLeave)
                .fetchSockets()
                .then((totalSockets) => {
                    io.of(ns.endpoint)
                        .in(roomToLeave)
                        .emit('update-user-count', totalSockets.length)
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})

function updateUserCount(nameSpace, room, cb) {
    io.of(nameSpace.endpoint)
        .in(room)
        .fetchSockets()
        .then((totalSockets) => {
            cb(totalSockets.length)
            io.of(nameSpace.endpoint)
                .in(room)
                .emit('update-user-count', totalSockets.length)
        })
        .catch((err) => {
            throw err
        })
}
