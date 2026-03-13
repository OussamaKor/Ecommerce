import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await db.connect();

    const order = await Order.findById(req.query.id);

    if (!order) {
      await db.disconnect();
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    if (order.isPaid) {
      await db.disconnect();
      return res.status(400).json({ message: 'Commande déjà payée' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body?.id || null,
      status: req.body?.status || 'COMPLETED',
      email_address: req.body?.email_address || null,
    };

    const paidOrder = await order.save();

    await db.disconnect();

    res.status(200).json({
      message: 'Commande payée avec succès',
      order: paidOrder,
    });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export default handler;