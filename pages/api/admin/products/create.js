import { getToken } from 'next-auth/jwt';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!user || !user.isAdmin) {
    return res.status(401).send({ message: 'Admin required' });
  }

  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Method not allowed' });
  }

  await db.connect();

  const product = new Product({
    name: req.body.name,
    slug: req.body.slug,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    countInStock: req.body.countInStock,
    description: req.body.description,
    colors: req.body.colors,
    image: req.body.colors?.[0]?.images?.[0] || '',
  });

  const createdProduct = await product.save();
  await db.disconnect();

  res.status(201).send(createdProduct);
};

export default handler;
