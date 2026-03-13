import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const round2 = (num) =>
    Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      dispatch({
        type: 'SAVE_PAYMENT_METHOD',
        payload: 'CashOnDelivery',
      });
    }
  }, [paymentMethod, dispatch]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );

      router.push(`/order/${data._id}`);
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Passer la commande">
      <CheckoutWizard activeStep={3} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800">
            Passer la commande
          </h1>

          {cartItems.length === 0 ? (
            <div className="rounded-lg bg-white p-6 shadow">
              Votre panier est vide.{' '}
              <Link href="/" className="font-medium text-stone-600 underline">
                Continuer vos achats
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-4">
              {/* GAUCHE */}
              <div className="md:col-span-3 space-y-6">

                {/* ADRESSE */}
                <div className="rounded-xl bg-white p-6 shadow">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Adresse de livraison
                    </h2>
                    <Link
                      href="/shipping"
                      className="text-sm font-medium text-stone-600 hover:underline"
                    >
                      Modifier
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600">
                    {shippingAddress.fullName}, {shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                    {shippingAddress.country}
                  </p>
                </div>

                {/* ARTICLES */}
                <div className="rounded-xl bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Articles commandés
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="border-b text-gray-500">
                        <tr>
                          <th className="py-3 text-left">Article</th>
                          <th className="py-3 text-right">Qté</th>
                          <th className="py-3 text-right">Prix</th>
                          <th className="py-3 text-right">Sous-total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr
                            key={`${item.slug}-${item.color}-${item.size}`}
                            className="border-b last:border-none"
                          >
                            <td className="py-4">
                              <Link
                                href={`/product/${item.slug}`}
                                className="flex items-center gap-3 text-stone-600 hover:underline"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={56}
                                  height={56}
                                  className="rounded-lg object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Couleur : {item.color} — Taille : {item.size}
                                  </p>
                                </div>
                              </Link>
                            </td>
                            <td className="py-4 text-right">
                              {item.quantity}
                            </td>
                            <td className="py-4 text-right">
                              {item.price} DT
                            </td>
                            <td className="py-4 text-right font-medium">
                              {item.quantity * item.price} DT
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Link
                    href="/cart"
                    className="mt-4 inline-block text-sm font-medium text-stone-600 hover:underline"
                  >
                    Modifier le panier
                  </Link>
                </div>
              </div>

              {/* DROITE */}
              <div className="md:col-span-1">
                <div className="sticky top-24 rounded-xl bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Récapitulatif
                  </h2>

                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between text-gray-600">
                      <span>Articles</span>
                      <span>{itemsPrice} DT</span>
                    </li>
                    <li className="flex justify-between border-t pt-3 text-base font-semibold text-gray-800">
                      <span>Total</span>
                      <span>{itemsPrice} DT</span>
                    </li>
                  </ul>

                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="mt-6 w-full rounded-lg bg-black py-3 text-lg font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {loading ? 'Traitement...' : 'Passer la commande'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

