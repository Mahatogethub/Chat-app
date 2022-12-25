const path= require("path")
const http=require('http')
const express=require("express");
const socketio=require("socket.io")
const formatMessages=require('../chatbox/utils/messages')
const {userjoin,getCurruntUser,userLeave,getroomUser} =require('../chatbox/utils/users')


const app=express();
const server=http.createServer(app)
const io=socketio(server)


//set static folder here
app.use(express.static(path.join(__dirname,"public")))

const botName='ChatBox'

// run when client connect with us
io.on('connection',socket =>{
    // console.log("New Connection....")

    socket.on('joinRoom',({username,room})=>{
        const user=userjoin(socket.id,username,room)
        socket.join(user.room)


        socket.emit('message',formatMessages(botName,`${user.username}"Welcome to ChatBox!"`));

        //broadcast message when users conennects
        socket.broadcast.to(user.room).emit('message',formatMessages(botName,`${user.username} has joined the chatbox`));


        //send users and room of info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getroomUser(user.room) 
        })
    })


    

    //Listen for chatMessage
    socket.on('chatMessage',msg=>{
        const user=getCurruntUser(socket.id)


       io.to(user.room).emit('message',formatMessages(user.username,msg))

       // runs when user disconnect
    socket.on('disconnect',()=>{

        const user=userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessages(botName,`${user.username} has left from the chat`));

            //send users and room of info
            io.to(user.room).emit('roomUsers',{
              room:user.room,
              users:getroomUser(user.room) 
        })
        }

    });
    });

});
const PORT=3000 ||process.env.PORT;


server.listen(PORT,()=>console.log(`server running on port ${PORT}`))