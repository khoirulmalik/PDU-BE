// uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // Mengimpor middleware
const uploadController = require("../controllers/uploadController");
const Upload = require("../models/uploadModel"); // Model MongoDB

// Rute untuk upload file
router.post("/upload", upload, uploadController.uploadImage);

router.get("/uploads", async (req, res) => {
  try {
    const uploads = await Upload.find(); // Ambil semua data upload dari database
    res.status(200).json(uploads); // Kirimkan data sebagai JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching uploads", error });
  }
});

module.exports = router;
