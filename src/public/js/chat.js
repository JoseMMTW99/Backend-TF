console.log('Bienvenidos al chat de WebSocket');

const socket = io();

let user
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa el usuario para identificarte en el chat',
    inputValidator: value => {
        return !value && 'Necesitas un nombre de usuario para avanzar'
    },
    allowOutsideClick: false
})
.then(result =>{
    user = result.value
})

// Input del Chat
chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if(chatBox.value.trim().length > 0){
            socket.emit('message', { user, message: chatBox.value})
            chatBox.value = '';
        }
    }}
)

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLog')

    let messages = '';
    data.forEach(message => {
        messages += `<li>${message.user} - Dice: ${message.message}</li><br>`
    });
    log.innerHTML = messages;
})