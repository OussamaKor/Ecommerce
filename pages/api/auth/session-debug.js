import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Vérifier les cookies reçus
  const cookies = req.cookies || {};
  const cookieNames = Object.keys(cookies);
  
  return res.status(200).json({
    hasToken: !!token,
    tokenData: token ? {
      _id: token._id,
      email: token.email,
      name: token.name,
      isAdmin: token.isAdmin,
    } : null,
    cookies: {
      present: cookieNames,
      count: cookieNames.length,
      hasSessionToken: cookieNames.some(name => name.includes('session-token')),
    },
    env: {
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasUrl: !!process.env.NEXTAUTH_URL,
      nextauthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
