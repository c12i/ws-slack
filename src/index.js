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
        nsSocket.emit('ns-room-load', namespaces[0].rooms)

        nsSocket.on('join-room', (roomData, userCountCallback) => {
            console.log(
                `${nsSocket.id} had joined the ${roomData.roomTitle} room`
            )
            const joinedRoom = ns.rooms.find((room) => room.id === roomData.id)
            // TODO: handle history
            nsSocket.join(joinedRoom.roomTitle)
            io.of(ns.endpoint)
                .in(joinedRoom.roomTitle)
                .fetchSockets()
                .then((totalSockets) => {
                    userCountCallback(totalSockets.length)
                    io.of(ns.endpoint)
                        .in(joinedRoom.roomTitle)
                        .emit('new-user-joined', totalSockets.length)
                })
                .catch((err) => {
                    throw err
                })
        })

        nsSocket.on('new-message-to-server', (message) => {
            console.log(`We have a new message from ${nsSocket.id}`, message)
            const roomToSend = Array.from(nsSocket.rooms.values())[1]
            io.of(ns.endpoint)
                .in(roomToSend)
                .emit(`message-to-clients`, message)
        })

        nsSocket.on('disconnect', () => {
            console.log(`${nsSocket.id} has disconnected`)
        })
    })
})
