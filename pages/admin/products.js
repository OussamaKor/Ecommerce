import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, successDelete: false };

    default:
      return state;
  }
}

export default function AdminProductsScreen() {
  const router = useRouter();

  const [{ loading, error, products, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      products: [],
      error: '',
    });

  const createHandler = () => {
    router.push('/admin/product/new');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/admin/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    }
    fetchData();
  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Produit supprimé');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  const getTotalStock = (product) => {
    if (!product.colors) return 0;
    return product.colors.reduce((total, color) => {
      return (
        total +
        color.sizes.reduce(
          (sum, size) => sum + size.countInStock,
          0
        )
      );
    }, 0);
  };

  return (
    <Layout title="Admin - Produits">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-4">

            {/* SIDEBAR */}
            <aside className="rounded-xl bg-white p-6 shadow">
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/admin/dashboard">Dashboard</Link></li>
                <li><Link href="/admin/orders">Commandes</Link></li>
                <li className="font-semibold text-stone-600">Produits</li>
                <li><Link href="/admin/users">Utilisateurs</Link></li>
              </ul>
            </aside>

            {/* CONTENT */}
            <div className="md:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Produits</h1>
                <button
                  onClick={createHandler}
                  className="rounded-lg bg-stone-600 px-5 py-2 text-sm text-white hover:bg-stone-700"
                >
                  Créer un produit
                </button>
              </div>

              {loadingDelete && (
                <div className="mb-4 bg-yellow-100 p-3 text-sm">
                  Suppression en cours…
                </div>
              )}

              {loading ? (
                <div className="bg-white p-6 shadow">Chargement…</div>
              ) : error ? (
                <div className="bg-red-100 p-4 text-red-700">{error}</div>
              ) : (
                <div className="rounded-xl bg-white shadow overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Image</th>
                        <th className="px-4 py-3 text-left">Nom</th>
                        <th className="px-4 py-3 text-left">Prix</th>
                        <th className="px-4 py-3 text-left">Catégorie</th>
                        <th className="px-4 py-3 text-left">Stock total</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-b">
                          <td className="px-4 py-3">
                            <Image
                              src={
                                product.colors?.[0]?.images?.[0] ||
                                product.image
                              }
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          </td>
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3 font-medium">
                            {product.price} DT
                          </td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">
                            {getTotalStock(product)}
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <Link
                              href={`/admin/product/${product._id}`}
                              className="rounded bg-gray-100 px-3 py-1 text-xs"
                            >
                              Modifier
                            </Link>
                            <button
                              onClick={() => deleteHandler(product._id)}
                              className="rounded bg-red-100 px-3 py-1 text-xs text-red-700"
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

AdminProductsScreen.auth = { adminOnly: true };
