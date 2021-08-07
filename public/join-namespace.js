function joinNamespaceAndLoadRooms(ns) {
    if (nsio) {
        nsio.close()
        document
            .querySelector('#user-input')
            .removeEventListener('submit', formSubmission)
    }
    nsio = io(`http://localhost:6969${ns.endpoint}`)
    nsio.on('ns-room-load', (nsRooms) => {
        const roomList = document.querySelector('.room-list')
        roomList.innerHTML = ''
        nsRooms.forEach((room) => {
            const listElement = document.createElement('li')
            listElement.setAttribute('roomId', room.roomId)
            listElement.textContent = room.roomTitle
            listElement.classList.add('room')
            const spanElement = document.createElement('span')
            spanElement.classList.add('glyphicon')
            if (room.privateRoom) {
                spanElement.classList.add('glyphicon-lock')
            } else {
                spanElement.classList.add('glyphicon-globe')
            }
            listElement.prepend(spanElement)
            roomList.appendChild(listElement)

            // add click event listener for each room node
            listElement.addEventListener('click', () => {
                // TODO: join room
                joinRoom({
                    roomId: room.roomId,
                    roomTitle: room.roomTitle,
                })
            })
        })

        // initially join the topmost room
        const roomNodes = document.getElementsByClassName('room')
        const room = {
            roomId: Number(roomNodes[0].getAttribute('roomId')),
            roomTitle: roomNodes[0].textContent,
        }
        joinRoom(room)
    })

    nsio.on('message-to-clients', (message) => {
        const messageNode = document.createElement('li')
        messageNode.innerHTML = buildMessage(message)
        document.querySelector('#messages').appendChild(messageNode)
    })

    document
        .querySelector('#user-input')
        .addEventListener('submit', formSubmission)
}

function buildMessage(msg) {
    return `
	<div class="user-image">
		<img src=${msg.avatar} />
	</div>
	<div class="user-message">
		<div class="user-name-time">${msg.username} <span>${new Date(
        msg.timeStamp
    ).toLocaleString()}</span></div>
		<div class="message-text">${msg.text}</div>
	</div>
	`
}

function formSubmission(event) {
    event.preventDefault()
    const message = document.querySelector('#user-message')
    nsio.emit('new-message-to-server', {
        text: message.value,
        timeStamp: new Date(),
        username,
        avatar: `https://via.placeholder.com/30`,
    })
    message.value = ''
}
