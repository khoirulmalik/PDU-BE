// socket.js
const { Server } = require("socket.io");
const Upload = require("./models/uploadModel"); 

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:8080", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Kirim data upload pertama kali ketika klien terhubung
    sendUploadsData();

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  
  setInterval(sendUploadsData, 5000);
}

// Fungsi untuk mengambil data dari database dan mengirim ke semua klien yang terhubung
async function sendUploadsData() {
  try {
    const uploads = await Upload.find(); // Ambil semua data upload dari database
    io.emit("uploadData", uploads); // Kirim data ke semua klien yang terhubung
    console.log("Data sent to clients"); // Logging untuk memastikan data terkirim
  } catch (error) {
    console.error("Error sending upload data:", error);
  }
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io belum diinisialisasi!");
  }
  return io;
}

module.exports = { initSocket, getIo };
