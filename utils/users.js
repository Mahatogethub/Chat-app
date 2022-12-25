const users=[];

function userjoin(id,username,room){
    const user={id,username,room}

    users.push(user);
    return user;
}


//get the currunt user

function getCurruntUser(id){
    return users.find(user=>user.id==id)
}


//user live chat 
function userLeave(id){
    const index=users.findIndex(user => user.id==id);

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

//get from users
function getroomUser(room){
    return users.filter(user=>user.room==room);
}

module.exports={userjoin,getCurruntUser,userLeave,getroomUser}
