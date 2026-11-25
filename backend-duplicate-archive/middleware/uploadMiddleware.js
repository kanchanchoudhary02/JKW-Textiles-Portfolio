const multer = require('multer');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
  return cb(new Error('Only JPG, PNG, WEBP or GIF images are allowed'));
}

// Memory storage keeps uploaded files in RAM only long enough to save them to MongoDB.
// This avoids Render/serverless filesystem persistence problems.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 30 },
});

module.exports = upload;
