// pages/api/admin/orders/[id]/deliver.js

import db from '../../../../../utils/db';
import Order from '../../../../../models/Order';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  await db.connect();

  const order = await Order.findById(req.query.id);

  if (!order) {
    await db.disconnect();
    return res.status(404).json({ message: 'Commande introuvable' });
  }

  order.isDelivered = !order.isDelivered;
  order.deliveredAt = order.isDelivered ? new Date() : null;

  await order.save();
  await db.disconnect();

  res.json(order);
}