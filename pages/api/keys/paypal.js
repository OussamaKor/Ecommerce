const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  res.status(200).send(process.env.PAYPAL_CLIENT_ID || 'sb');
};

export default handler;