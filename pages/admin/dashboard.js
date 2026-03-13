import axios from 'axios';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id),
    datasets: [
      {
        label: 'Ventes',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <Layout title="Tableau de bord Admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-4">

            {/* SIDEBAR */}
            <aside className="rounded-xl bg-white p-6 shadow">
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="font-semibold text-stone-600"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/orders" className="hover:text-stone-600">
                    Commandes
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products" className="hover:text-stone-600">
                    Produits
                  </Link>
                </li>
                <li>
                  <Link href="/admin/users" className="hover:text-stone-600">
                    Utilisateurs
                  </Link>
                </li>
              </ul>
            </aside>

            {/* CONTENT */}
            <div className="md:col-span-3">
              <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                Tableau de bord Administrateur
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
                <>
                  {/* KPI CARDS */}
                  <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-xl bg-white p-6 shadow">
                      <p className="text-3xl font-semibold text-gray-800">
                        {summary.ordersPrice} DT
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Chiffre d’affaires</p>
                      <Link
                        href="/admin/orders"
                        className="mt-2 inline-block text-sm font-medium text-stone-600 hover:underline"
                      >
                        Voir les ventes
                      </Link>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                      <p className="text-3xl font-semibold text-gray-800">
                        {summary.ordersCount}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Commandes</p>
                      <Link
                        href="/admin/orders"
                        className="mt-2 inline-block text-sm font-medium text-stone-600 hover:underline"
                      >
                        Voir les commandes
                      </Link>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                      <p className="text-3xl font-semibold text-gray-800">
                        {summary.productsCount}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Produits</p>
                      <Link
                        href="/admin/products"
                        className="mt-2 inline-block text-sm font-medium text-stone-600 hover:underline"
                      >
                        Voir les produits
                      </Link>
                    </div>

                  </div>

                  {/* RAPPORT DES VENTES */}
                  <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                      Rapport des ventes
                    </h2>
                    <Bar
                      options={options}
                      data={data}
                    />
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;