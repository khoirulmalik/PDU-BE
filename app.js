const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const { initSocket } = require("./socket"); // Import initSocket dari socket.js

dotenv.config();

const app = express();
const server = http.createServer(app); // Membuat server HTTP

const port = 3000;

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", uploadRoutes);

// Inisialisasi Socket.io
initSocket(server);

// Jalankan server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Koneksi ke database MongoDB
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
