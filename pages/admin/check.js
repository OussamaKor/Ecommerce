import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function AdminCheckScreen() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchDebug = async () => {
      try {
        const { data } = await axios.get('/api/auth/session-debug');
        setDebugInfo(data);
      } catch (error) {
        console.error('Error fetching debug info:', error);
      }
    };
    fetchDebug();
  }, []);

  return (
    <Layout title="Admin System Check">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <h1 className="mb-6 text-2xl font-bold">🔧 Vérification du système Admin</h1>

            {/* Session Status */}
            <div className="mb-6 rounded-lg border p-4">
              <h2 className="mb-3 font-semibold">📊 Status de session NextAuth</h2>
              <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
                {JSON.stringify({ status, session }, null, 2)}
              </pre>
            </div>

            {/* Token Debug */}
            {debugInfo && (
              <div className="mb-6 rounded-lg border p-4">
                <h2 className="mb-3 font-semibold">🔑 Token JWT Info</h2>
                <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}

            {/* Checklist */}
            <div className="rounded-lg border p-4">
              <h2 className="mb-3 font-semibold">✅ Checklist de configuration</h2>
              <ul className="space-y-2 text-sm">
                <li className={session ? 'text-green-600' : 'text-red-600'}>
                  {session ? '✅' : '❌'} Session utilisateur active
                </li>
                <li className={session?.user?.isAdmin ? 'text-green-600' : 'text-red-600'}>
                  {session?.user?.isAdmin ? '✅' : '❌'} isAdmin = true
                </li>
                <li className={debugInfo?.hasToken ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo?.hasToken ? '✅' : '❌'} Token JWT valide
                </li>
                <li className={debugInfo?.env?.hasSecret ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo?.env?.hasSecret ? '✅' : '❌'} NEXTAUTH_SECRET configuré
                </li>
                <li className={debugInfo?.env?.hasUrl ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo?.env?.hasUrl ? '✅' : '❌'} NEXTAUTH_URL configuré
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">💡 Solutions</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                {!session && (
                  <li>• Vous devez vous connecter d'abord</li>
                )}
                {session && !session.user?.isAdmin && (
                  <li>• Votre utilisateur n'a pas le statut admin dans la base de données</li>
                )}
                {!debugInfo?.env?.hasSecret && (
                  <li>• Ajoutez NEXTAUTH_SECRET dans Railway Variables</li>
                )}
                {!debugInfo?.env?.hasUrl && (
                  <li>• Ajoutez NEXTAUTH_URL dans Railway Variables</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
