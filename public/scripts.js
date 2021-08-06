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

function createNamespaceRooms(nsRooms) {
    const roomList = document.querySelector('.room-list')
    roomList.innerHTML = ''
    nsRooms.forEach((room) => {
        const listElement = document.createElement('li')
        listElement.textContent = room.roomTitle
        const spanElement = document.createElement('span')
        spanElement.classList.add('glyphicon')
        if (room.privateRoom) {
            spanElement.classList.add('glyphicon-lock')
        } else {
            spanElement.classList.add('glyphicon-globe')
        }
        listElement.appendChild(spanElement)
        roomList.appendChild(listElement)

        // add click event listener for each room node
        listElement.addEventListener('click', (event) => {
            console.log('someone clicked on the', event.target.innerText)
        })
    })
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
            nsio.on('ns-room-load', (nsRooms) => {
                createNamespaceRooms(nsRooms)
            })
        })

        const image = document.createElement('img')
        image.src = ns.img
        image.alt = 'logo'
        namespace.appendChild(image)
        namespaces.appendChild(namespace)

        nsio = io(`http://localhost:6969${nsList[0].endpoint}`)
        nsio.on('ns-room-load', (nsRooms) => {
            createNamespaceRooms(nsRooms)
        })
    })
})
