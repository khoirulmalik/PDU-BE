const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  tanggalUpload: {
    type: Date,
    default: Date.now, 
  },
  volumeBatu: {
    type: Number,
    required: true, 
  },
  jumlahBatu: {
    type: Number,
    required: true, 
  },
  namaFile: {
    type: String,
    required: true, 
  },
});

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;
