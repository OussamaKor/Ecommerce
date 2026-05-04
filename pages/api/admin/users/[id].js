import User from '../../../../models/User';
import db from '../../../../utils/db';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!user || !user.isAdmin) {
    return res.status(401).send('admin signin required');
  }

  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const deleteHandler = async (req, res) => {
  try {
    await db.connect();

    const user = await User.findById(req.query.id);

    if (!user) {
      await db.disconnect();
      return res.status(404).send({ message: 'Utilisateur introuvable' });
    }

    if (user.email === 'admin@example.com') {
      await db.disconnect();
      return res.status(400).send({ message: 'Impossible de supprimer cet admin' });
    }

    await User.findByIdAndDelete(req.query.id);

    await db.disconnect();
    res.status(200).send({ message: 'Utilisateur supprimé' });

  } catch (error) {
    await db.disconnect();
    res.status(500).send({ message: error.message });
  }
};

export default handler;
