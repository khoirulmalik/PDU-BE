const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const Upload = require("../models/uploadModel");
const { getIo } = require("../socket"); // Import getIo untuk menggunakan io

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Tidak ada file yang diunggah." });
  }

  const filePath = req.file.path;

  try {
    const image = fs.createReadStream(filePath);
    const form = new FormData();
    form.append("file", image);

    const aiApiUrl = "http://localhost:5000/upload"; // Endpoint AI 
    const aiResponse = await axios.post(aiApiUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log("Respons dari API AI:", aiResponse.data);

    const volumeBatu = parseFloat(aiResponse.data.batu_percentage);
    const jumlahBatu = aiResponse.data.jumlah_batu
      ? parseInt(aiResponse.data.jumlah_batu, 10)
      : 1;

    // Validasi jika volume batu tidak valid
    if (isNaN(volumeBatu)) {
      throw new Error("Volume batu yang diterima dari AI tidak valid.");
    }

    const uploadTime = new Date().toISOString();

    // Simpan informasi file dan hasil AI ke MongoDB
    const uploadData = new Upload({
      tanggalUpload: new Date(),
      volumeBatu: volumeBatu, // Volume batu diambil dari batu percentage
      jumlahBatu: jumlahBatu, // Jika API AI tidak menyediakan jumlah batu, bisa gunakan nilai default
      namaFile: req.file.filename,
    });

    // Menyimpan ke MongoDB
    await uploadData.save();

    // Emit hasil ke semua klien melalui Socket.io
    const io = getIo(); // Ambil instance io
    io.emit("ai-analysis-result", {
      volumeBatu,
      jumlahBatu,
      namaFile: req.file.filename,
      waktuUpload: new Date(),
    });

    // Kirim respons ke frontend
    res.status(200).json({
      message: "File dan data batu berhasil disimpan",
      uploadTime,
      file: req.file.filename,
      data: uploadData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message:
        "Terjadi kesalahan saat memproses gambar atau berkomunikasi dengan AI.",
      error: error.message,
    });
  } finally {
    // Hapus file setelah proses selesai
    fs.unlink(filePath, (err) => {
      if (err) console.error("Gagal menghapus file:", err);
    });
  }
};
