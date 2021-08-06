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
        const namespace = document.createElement('div')
        namespace.setAttribute('ns', ns.endpoint)
        namespace.classList.add('namespace')
        namespace.addEventListener('click', () => {
            socket.emit('switched-namespace', ns.id)
            joinNamespaceAndLoadRooms(ns)
        })

        const image = document.createElement('img')
        image.src = ns.img
        image.alt = 'logo'
        namespace.appendChild(image)
        namespaces.appendChild(namespace)
    })
    joinNamespaceAndLoadRooms(nsList[0])
})
