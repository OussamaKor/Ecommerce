import { getToken } from 'next-auth/jwt';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

 
  if (!token || !token.isAdmin) {
    return res.status(401).json({ message: 'Accès refusé - Admin requis' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await db.connect();

    // ⚠️ Important : garder commandes guest aussi
    const orders = await Order.find({})
      .populate('user', 'name') // si user null => pas d'erreur
      .sort({ createdAt: -1 });

    await db.disconnect();

    res.status(200).json(orders);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export default handler;