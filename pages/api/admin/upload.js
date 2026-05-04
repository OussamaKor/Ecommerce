import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { getToken } from 'next-auth/jwt';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Utiliser la mémoire au lieu du disque
const upload = multer({
  storage: multer.memoryStorage(),
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

// Fonction pour uploader sur Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mayastyle', // Nom du dossier sur Cloudinary
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export default async function handler(req, res) {
  try {
    // 🔐 ADMIN CHECK
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: 'Admin only' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Vérifier la config Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET) {
      console.error('❌ Configuration Cloudinary manquante');
      return res.status(500).json({ 
        message: 'Configuration Cloudinary manquante. Vérifiez vos variables d\'environnement.' 
      });
    }

    await runMiddleware(req, res, upload.single('image'));

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📤 Upload vers Cloudinary...', req.file.originalname);

    // Upload sur Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    console.log('✅ Upload réussi:', result.secure_url);

    return res.status(200).json(result.secure_url);
  } catch (error) {
    console.error('❌ UPLOAD ERROR:', error);
    return res.status(500).json({
      message: 'Upload failed',
      error: error.message,
      details: error.http_code || 'Unknown error'
    });
  }
}
