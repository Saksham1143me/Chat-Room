const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const router = require("./router");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
    origin: "https://chat-room-client-orcin.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
 }));

// Initialize Socket.IO with CORS options
const io = new Server(server
  // , {
  // cors: {
  //   origin: "https://chat-room-client-orcin.vercel.app",
  //   methods: ["GET", "POST"],
  //   credentials: true,
  //   transports: ['websocket', 'polling'],
  // },
// }
);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New connection established:", socket.id);

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      console.error("Join Error:", error);
      return callback({error});
    }

    socket.join(user.room);

    // Welcome the user
    socket.emit("message", {
      user: "Admin",
      text: `${user.name}, welcome to ${user.room}!`,
    });

    // Notify others in the room
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name} has joined!` });
    
    socket.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})
    console.log("User joined:", user);
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    console.log("SendMessage Event - Socket ID:", socket.id);

    const user = getUser(socket.id);

    if (!user) {
      console.error(`SendMessage Error - No user found with ID: ${socket.id}`);
      return callback("User not found.");
    }

    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {room:user.room,users:getUsersInRoom(user.room)});
    console.log(`Message sent to room ${user.room}:`, message);

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      console.log("User disconnected:", user);
    } else {
      console.log("Disconnected user was not found:", socket.id);
    }
  });
});

// Define routes
app.use(router);

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
