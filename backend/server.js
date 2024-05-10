const express = require("express");
// const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require('path');
// dotenv.config();
connectDB();
const app = express();

app.use(express.json()); //to accept JSON Data

// app.get('/', (req, res) => {
//     res.send("API");
// });

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message", messageRoutes);

// -------------------------------------------DEPLOYMENT---------------
const NODE_ENV = 'production';
const __dirname1 = path.resolve();
if(NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    });
    
}else{ 
    app.get("/", (req, res) => {
        res.send('API is running successfully');
    })
}


// --------------------------------DEPLOYMENT------------

app.use(notFound);
app.use(errorHandler);

const PORT = 5000;
const server = app.listen(PORT, console.log(`Server started on ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    }
});

io.on("connection", (socket) => {
    console.log('connected to io');
    
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User joined room'+ room);
    });

    socket.on('new message' , (newMessageRead) => {
        var chat = newMessageRead.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if(user._id == newMessageRead.sender._id) return;

            socket.in(user._id).emit("message received", newMessageRead);
        });
    })

    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    });

    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})