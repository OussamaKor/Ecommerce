import db from '../../../../utils/db';
import Order from '../../../../models/Order';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await db.connect();

    const order = await Order.findById(req.query.id);

    if (!order) {
      await db.disconnect();
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    await db.disconnect();
    return res.status(200).json(order);

  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}