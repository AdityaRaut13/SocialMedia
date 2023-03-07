const multer = require("multer");

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    cb(null, false);
  }
  cb(null, true);
};

let upload = multer({
  dest: process.env.FILE_STORAGE,
  limits: {
    fileSize: 1048576 * 2,
  },
  fileFilter,
});

module.exports = upload;
