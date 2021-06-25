import multer from "multer";
var phototypes = /jpeg|jpg|png/;

var storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fields: 1, // 1 non-file field
    fileSize: 10000000, // 9mb maximum size
    files: 1, // maximum 1 file
    parts: 2, // files + fields
  },
});
const uploadCard = multer({
  storage,
  limits: {
    fields: 4, // 1 non-file field
    fileSize: 10000000, // 10mb maximum size
    files: 1, // maximum 1 file
    parts: 5, // files + fields
  },
});
const uploadCardEDIT = multer({
  storage,
  limits: {
    fields: 5, // 1 non-file field
    fileSize: 10000000, // 10mb maximum size
    files: 1, // maximum 1 file
    parts: 6, // files + fields
  },
});
export default { upload, uploadCard, uploadCardEDIT };
