function joinRoom(room) {
    console.log(room)
    // emit the room info to server
    nsio.emit('join-room', room, (newMemberCount) => {
        // update room member total
        const memberCountNode = document.querySelector('.curr-room-num-users')
        memberCountNode.innerHTML = `${
            newMemberCount + ' '
        } <span class="glyphicon glyphicon-user"></span>`
    })
}
