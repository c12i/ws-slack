function joinNamespaceAndLoadRooms(endpoint) {
    const nsio = io(`http://localhost:6969${endpoint}`)
    nsio.on('ns-room-load', (nsRooms) => {
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
    })

    nsio.on('message-to-clients', (message) => {
        console.log(message)
        const messageNode = document.createElement('li')
        messageNode.textContent = message
        document.querySelector('#messages').appendChild(messageNode)
    })

    document
        .querySelector('.message-form')
        .addEventListener('submit', (event) => {
            event.preventDefault()
            const message = document.querySelector('#user-message').value
            socket.emit('new-message-to-server', { text: message })
        })
}
