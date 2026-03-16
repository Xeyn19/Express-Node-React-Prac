import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(__dirname, "../../uploads/resumes");
const allowedExtensions = new Set([".pdf", ".doc", ".docx"]);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.has(ext)) {
    cb(new Error("Only .pdf, .doc, or .docx files are allowed."));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadResume = (req, res, next) => {
  const handler = upload.single("resume");

  handler(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message || "Resume upload failed.",
      });
    }

    return next();
  });
};
