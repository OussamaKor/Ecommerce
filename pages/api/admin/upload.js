import multer from 'multer';
import { getToken } from 'next-auth/jwt';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });
}

export default async function handler(req, res) {
  try {
    // 🔐 ADMIN CHECK
    const user = await getToken({ req });
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: 'Admin only' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    await runMiddleware(req, res, upload.single('image'));

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    return res.status(200).json(`/images/${req.file.filename}`);
  } catch (error) {
    console.error('UPLOAD ERROR 👉', error);
    return res.status(500).json({
      message: 'Upload failed',
      error: error.message,
    });
  }
}
