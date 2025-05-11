# WebRTC Broadcast Room

A lightweight WebRTC-based one-to-many broadcast system using Socket.IO. This project allows a **host** to stream audio/video to multiple **viewers** in real time, complete with:

- 🧑‍💻 Room-based streaming
- 🎥 Host video/audio controls
- 🖥️ Screen sharing support
- 💬 Live chat
- 👥 Dynamic user list
- ❌ Meeting end and leave features

## 🚀 Features

- Host creates a room with a unique ID and broadcasts their stream.
- Viewers join the room using the ID and watch the host live.
- Chat functionality with real-time messaging.
- Screen sharing from host to all viewers.
- Host can end the meeting for all participants.
- Viewers can leave the meeting at any time.

## 🛠️ Tech Stack

- WebRTC (Media & Peer Connections)
- Socket.IO (Signaling & Messaging)
- Express.js (Server)
- HTML/CSS/JavaScript (Frontend)

## 📁 Project Structure

webrtc-broadcast-room/
├── public/
│ ├── host.html # Host UI
│ └── viewer.html # Viewer UI
├── server.js # Express + Socket.IO server
└── README.md


## 🧪 Local Setup

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/webrtc-broadcast-room.git
cd webrtc-broadcast-room
```
2. **Install dependencies:**
 ```bash
npm install
npm i express socket.io

node server.js

```
3. **Open in browser:**

Host: http://localhost:3000/host.html

Viewer: http://localhost:3000/viewer.html



🧑‍💻 Usage
-The host enters their name and creates a room.

-Viewers enter their name and the room ID to join.

-All users can chat and view the participant list.

-Host can control video/audio, share screen, and end the meeting.
