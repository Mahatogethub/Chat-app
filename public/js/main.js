const chatForm=document.getElementById('chat-form');
const chatMassages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');


// get username and room form Url
const {username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix:true
})
// console.log(username,room)

const socket=io()

//join chat room
socket.emit('joinRoom',{username,room});

//get room and users
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
});


//message from server
socket.on('message',(message)=>{
  console.log(message);
  outputMessage(message);

  //scroll down 
  chatMassages.scrollTop=chatMassages.scrollHeight;
})

//Message submit by user form chat
chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  //get message text
  let msg=e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }
  //emit message to the server 
  socket.emit('chatMessage',msg)

  
  //clear the inputs messages
  e.target.elements.msg.value='';
  e.target.elements.msg.focus();


});


//output message to DOM;
function outputMessage(message){
  const div=document.createElement('div')
  div.classList.add('message')

  const p=document.createElement('p')
  p.classList.add('meta');
  p.innerHTML=message.username;
  p.innerHTML+=`<span>${message.time}</span>`;
  div.appendChild(p);

  const para=document.createElement('p')
  para.classList.add('text');
  para.innerHTML=message.text;
  div.appendChild(para);

  // div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
  // <p class="text">${message.text} </p>`;
  document.querySelector('.chat-messages').appendChild(div)
}


//add room name to dom
function outputRoomName(room){
  roomName.innerText=room;
  
}
//add user to dom
function outputUsers(users){
  // userList.innerHTML=`${users.map(user=>`<li>${user.username.join('')}</li>`)}`
   userList.innerHTML='';
   users.forEach((user)=>{
    const li=document.createElement('li');
    li.innerText=user.username;
    userList.appendChild(li);
   });
}

//prompt the user before leave chat from;
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if(leaveRoom){
    window.location = '../index.html';
  } else {
  }
});

