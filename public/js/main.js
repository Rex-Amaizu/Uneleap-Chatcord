const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

//Join Chatroom
socket.emit('joinRoom', { username, room});

//Get room and users
socket.on('roomUsers', ({ users, rooms }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    console.log(message);
    outPutMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage',msg);

    //Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//outPutMessage to DOM
function outPutMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {

    roomName.innerText = room;

}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
            ${users.map(user => `<li>${user.username}</li>`).join('')}
        `;
}