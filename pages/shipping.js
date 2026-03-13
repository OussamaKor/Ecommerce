import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress = {} } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('phone', shippingAddress.phone);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, phone }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, phone },
    });

    dispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: 'CashOnDelivery',
    });

    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: { fullName, address, phone },
        paymentMethod: 'CashOnDelivery',
      })
    );

    router.push('/placeorder');
  };

  return (
    <Layout title="Adresse de livraison">
      <CheckoutWizard activeStep={1} />

      <div className="min-h-screen bg-gray-50 py-10">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-lg"
        >
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">
            Adresse de livraison
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Veuillez renseigner vos informations de livraison
          </p>

          {/* Nom & Prénom */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nom et prénom
            </label>
            <input
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-4 py-2
                         focus:border-stone-400 focus:outline-none
                         focus:ring-2 focus:ring-stone-200"
              {...register('fullName', {
                required: 'Veuillez entrer votre nom et prénom',
              })}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Adresse complète */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Adresse complète
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2
                         focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              {...register('address', {
                required: 'Veuillez entrer votre adresse',
                minLength: {
                  value: 5,
                  message: 'Adresse trop courte',
                },
              })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              className="w-full rounded-lg border border-gray-300 px-4 py-2
                         focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              {...register('phone', {
                required: 'Veuillez entrer votre numéro',
                pattern: {
                  value: /^[0-9+\s-]{6,}$/,
                  message: 'Numéro invalide',
                },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 text-lg
                       font-semibold text-white transition
                       hover:bg-gray-800 active:scale-[0.98]"
          >
            Continuer vers la commande
          </button>
        </form>
      </div>
    </Layout>
  );
}
