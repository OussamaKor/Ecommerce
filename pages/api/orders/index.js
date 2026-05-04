import { getToken } from 'next-auth/jwt';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  await db.connect();

  // Vérifie si utilisateur connecté (optionnel)
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const newOrder = new Order({
    ...req.body,
    user: user ? user._id : null, // 🔥 utilisateur optionnel
  });

  const order = await newOrder.save();

  await db.disconnect();

  res.status(201).send(order);
};

export default handler;