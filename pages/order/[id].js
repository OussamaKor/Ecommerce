import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return { ...state, loadingDeliver: false, successDeliver: false };

    default:
      return state;
  }
}

function OrderScreen() {
  const { data: session } = useSession();
  const { query } = useRouter();
  const orderId = query.id;

  const [, paypalDispatch] = usePayPalScriptReducer();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      order._id !== orderId
    ) {
      fetchOrder();
      if (successPay) dispatch({ type: 'PAY_RESET' });
      if (successDeliver) dispatch({ type: 'DELIVER_RESET' });
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'USD' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay, successDeliver]);

  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    isPaid,
    isDelivered,
    deliveredAt,
  } = order;




  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      await axios.put(`/api/admin/orders/${order._id}/deliver`);
      dispatch({ type: 'DELIVER_SUCCESS' });
      toast.success('Commande marquée comme livrée');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return (
    <Layout title={`Commande ${orderId}`}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800">
            Commande {orderId}
          </h1>

          {loading ? (
            <div className="rounded-lg bg-white p-6 shadow">
              Chargement…
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-100 p-4 text-red-700 shadow">
              {error}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-4">

              {/* GAUCHE */}
              <div className="md:col-span-3 space-y-6">

                {/* LIVRAISON */}
                <div className="rounded-xl bg-white p-6 shadow">
                  <h2 className="mb-3 text-lg font-semibold text-gray-800">
                    Adresse de livraison
                  </h2>

                  <p className="text-sm text-gray-600">
                    {shippingAddress.fullName}, {shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                    {shippingAddress.country}
                  </p>

                  {isDelivered ? (
                    <div className="mt-4 inline-block rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                      Livrée le {deliveredAt}
                    </div>
                  ) : (
                    <div className="mt-4 inline-block rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                      Non livrée
                    </div>
                  )}
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
                        {orderItems.map((item) => (
                          <tr
                            key={`${item.slug}-${item.color}-${item.size}`}
                            className="border-b last:border-none"
                          >
                            <td className="py-4">
                              <Link
                                href={`/product/${item.slug}`}
                                className="flex items-center gap-3 hover:underline"
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
                            <td className="py-4 text-right">{item.quantity}</td>
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

                  {session?.user?.isAdmin &&
                    isPaid &&
                    !isDelivered && (
                      <div className="mt-6">
                        {loadingDeliver && (
                          <div className="mb-2 text-sm text-gray-500">
                            Traitement…
                          </div>
                        )}
                        <button
                          onClick={deliverOrderHandler}
                          className="w-full rounded-lg bg-stone-400 py-3 text-lg font-semibold text-black transition hover:bg-stone-500"
                        >
                          Marquer comme livrée
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default OrderScreen;
