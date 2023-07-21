const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 3001;  ///in case a port is allocated at production use that else use 3001.

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{               //use to server a file when a use hits root directory
    res.sendFile(__dirname+'/index.html');    //root directory path + /index.html
});

/*Socket.io Set up start*/
 
const io = require("socket.io")(server);
var users={};

io.on("connection",(socket)=>{       //socket.io generates unique id for each socket
    socket.on("new-user-joined",(username)=>{
        users[socket.id]=username;
        socket.broadcast.emit('user-connected',username);
        io.emit("users-list",users);
    });

    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected',user=users[socket.id]);
        delete users[socket.id];
        io.emit("users-list",users);
    }) 

    socket.on('message',(data)=>{
        socket.broadcast.emit("message",{user: data.user, msg: data.msg});
    });

}); 
 
/*Socket.io Set up end*/

server.listen(port,()=>{
    console.log("Server started at "+port);
});
