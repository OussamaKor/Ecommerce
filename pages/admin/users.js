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
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

function AdminUsersScreen() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/users/${userId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Utilisateur supprimé avec succès');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Gestion des utilisateurs">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-4">

            {/* SIDEBAR */}
            <aside className="rounded-xl bg-white p-6 shadow">
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li>
                  <Link href="/admin/dashboard" className="hover:text-stone-600">
                    Tableau de bord
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
                  <Link
                    href="/admin/users"
                    className="font-semibold text-stone-600"
                  >
                    Utilisateurs
                  </Link>
                </li>
              </ul>
            </aside>

            {/* CONTENT */}
            <div className="md:col-span-3">
              <h1 className="mb-6 text-2xl font-semibold text-gray-800">
                Gestion des utilisateurs
              </h1>

              {loadingDelete && (
                <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm">
                  Suppression en cours...
                </div>
              )}

              {loading ? (
                <div className="rounded-lg bg-white p-6 shadow">
                  Chargement...
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-100 p-4 text-red-700 shadow">
                  {error}
                </div>
              ) : (
                <div className="rounded-xl bg-white shadow overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Nom</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Admin</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium">
                            {user._id.substring(20, 24)}
                          </td>
                          <td className="px-4 py-3">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            {user.isAdmin ? (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                Oui
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                Non
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <Link
                              href={`/admin/user/${user._id}`}
                              className="rounded bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
                            >
                              Modifier
                            </Link>
                            <button
                              onClick={() => deleteHandler(user._id)}
                              className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

AdminUsersScreen.auth = { adminOnly: true };
export default AdminUsersScreen;