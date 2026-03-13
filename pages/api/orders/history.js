import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await db.connect();

    const orders = await Order.find({})
      .sort({ createdAt: -1 });

    await db.disconnect();

    res.status(200).json(orders);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export default handler;