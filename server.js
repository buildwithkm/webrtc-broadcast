const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const rooms = {};

io.on("connection", socket => {
  socket.on("create-room", ({ roomId, username }) => {
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId;

    rooms[roomId] = rooms[roomId] || { hostId: socket.id, users: {} };
    rooms[roomId].users[socket.id] = username;

    io.to(roomId).emit("update-user-list", rooms[roomId].users);
  });

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId;

    rooms[roomId] = rooms[roomId] || { users: {} };
    rooms[roomId].users[socket.id] = username;

    const hostId = rooms[roomId].hostId;
    if (hostId) {
      io.to(hostId).emit("new-viewer", { viewerId: socket.id });
    }

    io.to(roomId).emit("update-user-list", rooms[roomId].users);
  });

  socket.on("host-offer", ({ offer, viewerId }) => {
    io.to(viewerId).emit("receive-offer", { offer, hostId: socket.id });
  });

  socket.on("viewer-answer", ({ answer, hostId }) => {
    io.to(hostId).emit("receive-answer", { answer, viewerId: socket.id });
  });

  socket.on("ice-candidate", ({ candidate, targetId }) => {
    io.to(targetId).emit("ice-candidate", {
      candidate,
      senderId: socket.id,
    });
  });

  socket.on("chat-message", message => {
    io.to(socket.roomId).emit("chat-message", {
      user: socket.username,
      message
    });
  });

  socket.on("end-meeting", () => {
    io.to(socket.roomId).emit("meeting-ended");
    delete rooms[socket.roomId];
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
      delete rooms[roomId].users[socket.id];
      io.to(roomId).emit("update-user-list", rooms[roomId].users);
    }
  });
});

server.listen(3090, () => {
  console.log("Server running on http://localhost:3090");
});
