const socket = io();
const username = prompt("Enter your name");
const roomId = prompt("Enter Room ID to join");
const video = document.getElementById("remoteVideo");
const messages = document.getElementById("messages");
const userList = document.getElementById("userList");
let pc;

socket.emit("join-room", { roomId, username });

socket.on("receive-offer", async ({ offer, hostId }) => {
    pc = new RTCPeerConnection();
    pc.ontrack = e => {
        video.srcObject = e.streams[0];
    };
    pc.onicecandidate = e => {
        if (e.candidate) {
            socket.emit("ice-candidate", { candidate: e.candidate, targetId: hostId });
        }
    };
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("viewer-answer", { answer, hostId });
});

socket.on("ice-candidate", ({ candidate, senderId }) => {
    pc.addIceCandidate(new RTCIceCandidate(candidate));
});

function sendMessage() {
    const input = document.getElementById("chatInput");
    if (input.value) {
        socket.emit("chat-message", input.value);
        input.value = "";
    }
}

socket.on("chat-message", ({ user, message }) => {
    messages.innerHTML += `<div><b>${user}:</b> ${message}</div>`;
});

socket.on("update-user-list", users => {
    userList.innerHTML = "";
    for (let id in users) {
        const li = document.createElement("li");
        li.textContent = users[id];
        userList.appendChild(li);
    }
});

socket.on("meeting-ended", () => {
    alert("Meeting ended by host.");
    window.location.reload();
});

function leaveMeeting() {
    alert("You have left the meeting.");
    window.location.reload();
}