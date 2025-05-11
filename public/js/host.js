const socket = io();
const username = prompt("Enter your name");
const roomId = prompt("Enter room ID to create");
const video = document.getElementById("hostVideo");
const peerConnections = {};
const messages = document.getElementById("messages");
const userList = document.getElementById("userList");
let stream;

socket.emit("create-room", { roomId, username });

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => {
    stream = s;
    video.srcObject = stream;
});

socket.on("new-viewer", async ({ viewerId }) => {
    const pc = new RTCPeerConnection();
    peerConnections[viewerId] = pc;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    pc.onicecandidate = e => {
        if (e.candidate) socket.emit("ice-candidate", { candidate: e.candidate, targetId: viewerId });
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("host-offer", { offer, viewerId });
});

socket.on("receive-answer", ({ answer, viewerId }) => {
    peerConnections[viewerId].setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on("ice-candidate", ({ candidate, senderId }) => {
    peerConnections[senderId].addIceCandidate(new RTCIceCandidate(candidate));
});

function toggleVideo() {
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
}

function toggleAudio() {
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
}

function shareScreen() {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then(screenStream => {
        const screenTrack = screenStream.getVideoTracks()[0];
        Object.values(peerConnections).forEach(pc => {
            const sender = pc.getSenders().find(s => s.track.kind === "video");
            sender.replaceTrack(screenTrack);
        });
    });
}

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

function endMeeting() {
    socket.emit("end-meeting");
    window.location.reload();
}