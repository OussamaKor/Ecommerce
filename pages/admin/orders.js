import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  /* ---------------- FETCH ---------------- */
  const fetchOrders = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get('/api/admin/orders');
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- TOGGLE PAYÉ ---------------- */
  const togglePaid = async (id) => {
    try {
      await axios.put(`/api/admin/orders/${id}/pay`);
      toast.success('Statut de paiement mis à jour');
      fetchOrders();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du paiement');
    }
  };

  /* ---------------- TOGGLE LIVRÉ ---------------- */
  const toggleDelivered = async (id) => {
    try {
      await axios.put(`/api/admin/orders/${id}/deliver`);
      toast.success('Statut de livraison mis à jour');
      fetchOrders();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour de la livraison');
    }
  };

  return (
    <Layout title="Admin - Commandes">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-4">

            {/* SIDEBAR */}
            <aside className="rounded-xl bg-white p-6 shadow">
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="font-semibold text-stone-600">
                  Commandes
                </li>
                <li>
                  <Link href="/admin/products">Produits</Link>
                </li>
                <li>
                  <Link href="/admin/users">Utilisateurs</Link>
                </li>
              </ul>
            </aside>

            {/* CONTENT */}
            <div className="md:col-span-3">
              <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                Liste des commandes
              </h1>

              {loading ? (
                <div className="rounded-lg bg-white p-6 shadow">
                  Chargement...
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-100 p-4 text-red-700 shadow">
                  {error}
                </div>
              ) : (
                <div className="rounded-xl bg-white shadow">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Client</th>
                          <th className="px-4 py-3 text-left">Téléphone</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Total</th>
                          <th className="px-4 py-3 text-left">Paiement</th>
                          <th className="px-4 py-3 text-left">Livraison</th>
                          <th className="px-4 py-3 text-left">Détails</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order._id}
                            className="border-b last:border-none hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 font-medium">
                              {order._id.substring(20, 24)}
                            </td>

                            {/* Nom complet */}
                            <td className="px-4 py-3">
                              {order.shippingAddress?.fullName}
                            </td>

                            {/* Téléphone */}
                            <td className="px-4 py-3">
                              {order.shippingAddress?.phone}
                            </td>

                            <td className="px-4 py-3">
                              {order.createdAt.substring(0, 10)}
                            </td>

                            <td className="px-4 py-3 font-medium">
                              {order.totalPrice} DT
                            </td>

                            {/* TOGGLE PAIEMENT */}
                            <td className="px-4 py-3">
                              <button
                                onClick={() => togglePaid(order._id)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                  order.isPaid
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {order.isPaid ? 'Payée' : 'Non payée'}
                              </button>
                            </td>

                            {/* TOGGLE LIVRAISON */}
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleDelivered(order._id)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                  order.isDelivered
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}
                              >
                                {order.isDelivered ? 'Livrée' : 'En attente'}
                              </button>
                            </td>

                            <td className="px-4 py-3">
                              <Link
                                href={`/order/${order._id}`}
                                className="font-medium text-stone-600 hover:underline"
                              >
                                Voir
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

AdminOrderScreen.auth = { adminOnly: true };