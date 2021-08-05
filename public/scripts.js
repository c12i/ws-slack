const socket = io('http://localhost:4231')
const socket2 = io('http://localhost:4231/admin')

socket.on('server-message', (data) => {
    console.info(data)
    socket.emit('message-to-server', { data: 'Hi from the client' })
})

socket.on('joined', (data) => {
    console.log(data)
})

socket2.on('admin-message', (data) => {
    console.info(data)
})

const messageForm = document.getElementById('message-form')
messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('user-message')
    socket.emit('new-message', { text: input.value })
    input.value = ''
})
