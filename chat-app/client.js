let socket = null;
let username = null;

let chatContainer = document.getElementById('chat-container');
let loginContainer = document.getElementById('login-container');
let logoutButton = document.getElementById('logout-button');
let messageContainer = document.getElementById('message-container');
let textSend = document.getElementById('text-send');
let buttonSend = document.getElementById('button-send');
buttonSend.disabled = true;

fetch('/staticvalues').then(resp => resp.json()).then(data => {
    document.getElementById('hostname').innerHTML = ` <div style="font-weight:1000;" class="alert alert-warning" role="alert">CONNECTED POD: ${data.HOSTNAME}</div>`;
    buttonSend.disabled = false;
});

loginContainer.addEventListener('submit', function(event) {
    event.preventDefault();
    username = document.getElementById('usernameInput').value;
    
    connect();

    loginContainer.remove();
    document.getElementById('username-span').innerHTML = username;
    listenMessages();
    chatContainer.style.visibility = 'visible'
});

buttonSend.addEventListener('click', function(){
    sendMessage();
});

logoutButton.addEventListener('click', function() {
    document.querySelector('body').append(loginContainer);
    socket.emit('LOGOUT', username)
    socket.close();
    location.replace('/');
});

function connect(){
    socket = io();
    socket.emit('USER_CONNECTED', username);
}

function listenMessages(){
    socket.on('MESSAGE', function(message) {
        let element = document.createElement('div');
        element.innerHTML = createMessageElement(message);
        messageContainer.appendChild(element);
    });
}

function sendMessage(){
    let message =  textSend.value;
    let sender = username;
    let obj = {
        sender:sender,
        message:message,
    }
    textSend.value = ''
    socket.emit('MESSAGE',obj);
}

function createMessageElement(message){
    if(message.type === 'connected'){
        return `<div class="alert alert-success" role="alert"> <span style='font-weight: 900'>${message.message}</span> connected.</div>`
    }
    else if(message.type === 'disconnected'){
        return `<div class="alert alert-danger" role="alert"> <span style='font-weight: 900'>${message.message}</span> disconnected.</div>`
    }
    else if(message.type === 'message'){
        return `<div class="alert alert-secondary" role="alert"> <span style='font-weight: 900'>${message.sender}:</span> ${message.message} </div>`
    }
    else{
        console.log('Unkown message type from server.');
    }
}