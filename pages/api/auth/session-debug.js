import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  const token = await getToken({ req });
  
  return res.status(200).json({
    hasToken: !!token,
    tokenData: token ? {
      _id: token._id,
      email: token.email,
      name: token.name,
      isAdmin: token.isAdmin,
    } : null,
    env: {
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasUrl: !!process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
