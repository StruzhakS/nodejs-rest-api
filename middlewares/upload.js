import multer from 'multer';
import path from 'path';

const destination = path.resolve('temp');

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    const uniqePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});
const limits = {
  fileSize: 1024 * 1024 * 5,
};
const upload = multer({ storage, limits });

export default upload;
