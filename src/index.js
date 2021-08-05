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
    const nsData = namespaces.map(({ img, endpoint }) => ({ img, endpoint }))

    // send the ns data back to the client
    socket.emit('ns-list', nsData)

    socket.on('joining-namespace', (data) => {
        console.info('user joined', data)
    })
})

// loop through each namespace and listen to a connection
namespaces.forEach((ns) => {
    io.of(ns.endpoint).on('connection', (socket) => {
        console.log(`${socket.id} has joined ${ns.endpoint}`)
        socket.emit('hello', `Hello welcome to the ${ns.nsTitle} namespace`)
    })
})
