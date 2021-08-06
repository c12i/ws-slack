const socket = io('http://localhost:6969')
let nsio

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
            socket.emit('joining-namespace', { username, namespace: ns })
            nsio = io(`http://localhost:6969${ns.endpoint}`)
            nsio.on('ns-room-load', (rooms) => {
                console.log(rooms)
            })
        })

        const image = document.createElement('img')
        image.src = ns.img
        image.alt = 'logo'
        namespace.appendChild(image)
        namespaces.appendChild(namespace)

        nsio = io(`http://localhost:6969${nsList[0].endpoint}`)
        nsio.on('ns-room-load', (rooms) => {
            const roomList = document.querySelector('.room-list')
        })
    })
})
