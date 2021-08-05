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
        // namespaces.innerHTML += `<div class="namespace" ns="/${ns.endpoint}"><img src=${ns.img} alt="logo"></div>`
        const namespace = document.createElement('div')
        namespace['ns'] = ns.endpoint
        namespace.classList.add('namespace')
        namespace.addEventListener('click', () => {
            console.log(ns)
            socket.emit('joining-namespace', { username, namespace: ns })
        })

        const image = document.createElement('img')
        image.src = ns.img
        image.alt = 'logo'
        namespace.appendChild(image)
        namespaces.appendChild(namespace)
    })
})

const messageForm = document.getElementById('message-form')
messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('user-message')
    socket.emit('new-message', { text: input.value })
    input.value = ''
})

socket.on('message-to-clients', ({ text }) => {
    const listGroup = document.getElementById('messages')
    const listItem = document.createElement('li')
    listItem.textContent = text
    listGroup.appendChild(listItem)
})
