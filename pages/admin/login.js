import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function AdminLoginScreen() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [session, router]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <Layout title="Connexion Admin">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow"
        >
          <h1 className="mb-6 text-2xl font-semibold text-center">
            Connexion Admin
          </h1>

          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email requis' })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label>Mot de passe</label>
            <input
              type="password"
              {...register('password', { required: 'Mot de passe requis' })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <button className="w-full bg-black text-white py-3 rounded">
            Se connecter
          </button>
        </form>
      </div>
    </Layout>
  );
}