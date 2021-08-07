function joinRoom(room) {
    document.querySelector('.curr-room-text').textContent = room.roomTitle

    // emit the room info to server
    nsio.emit('join-room', room, (newMemberCount) => {
        // update room member total
        const memberCountNode = document.querySelector('.curr-room-num-users')
        memberCountNode.innerHTML = `${
            newMemberCount + ' '
        } <span class="glyphicon glyphicon-user"></span>`
    })

    nsio.on('history-catch-up', (messages) => {
        const messagesNode = document.querySelector('#messages')
        messagesNode.innerHTML = ''
        messages.forEach((message) => {
            const messageNode = document.createElement('li')
            messageNode.innerHTML = buildMessage(message)
            messagesNode.appendChild(messageNode)
        })
        messagesNode.scrollTo(0, messagesNode.scrollHeight)
    })

    nsio.on('update-user-count', (data) => {
        const memberCountNode = document.querySelector('.curr-room-num-users')
        const spanNode = document.createElement('span')
        spanNode.classList = 'glyphicon glyphicon-user'
        memberCountNode.textContent = data + ' '
        memberCountNode.appendChild(spanNode)
    })

    const searchBox = document.querySelector('#search-box')
    searchBox.addEventListener('input', (e) => {
        let messages = Array.from(
            document.getElementsByClassName('message-text')
        )
        messages.forEach((message) => {
            if (
                message.textContent
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) === -1
            ) {
                message.parentNode.parentElement.style.display = 'none'
            } else {
                message.parentNode.parentElement.style.display = 'flex'
            }
        })
    })
}
