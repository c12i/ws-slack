const socket = io('http://localhost:6969')

const existing = sessionStorage.getItem(`username`)
let username

if (existing) {
    username = existing
} else {
    username = prompt('Enter a username', 'anonymous')
    sessionStorage.setItem('username', username)
}

socket.on('ns-list', (nsList) => {
    const namespaces = document.querySelector('.namespaces')
    namespaces.innerHTML = ''
    nsList.forEach((ns) => {
        const namespace = document.createElement('div')
        namespace['ns'] = ns.endpoint
        namespace.classList.add('namespace')
        namespace.addEventListener('click', () => {
            joinNamespaceAndLoadRooms(ns.endpoint)
        })

        const image = document.createElement('img')
        image.src = ns.img
        image.alt = 'logo'
        namespace.appendChild(image)
        namespaces.appendChild(namespace)

        joinNamespaceAndLoadRooms(ns.endpoint)
    })
})

socket.on('message-from-server', (message) => {})

document.querySelector('.message-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const message = document.querySelector('#user-message').value
    socket.emit('new-message-to-server', { text: message })
})

socket.on('message-to-clients', (message) => {
    console.log(message)
    const messageNode = document.createElement('li')
    messageNode.textContent = message
    document.querySelector('#messages').appendChild(messageNode)
})
