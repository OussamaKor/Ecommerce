import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  /* ---------- SUPPRIMER ---------- */
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  /* ---------- METTRE À JOUR QTY ---------- */
  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty);

    if (item.sizeStock < quantity) {
      return toast.error('Désolé, cette taille est en rupture de stock');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });

    toast.success('Produit mis à jour dans le panier');
  };

  return (
    <Layout title="Mon Panier">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* TITRE */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-neutral-900">
            Mon Panier
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-neutral-500">
            Votre panier est vide.{' '}
            <Link href="/" className="underline">
              Continuez vos achats !
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">

            {/* ---------- ARTICLES ---------- */}
            <div className="space-y-10">
              {cartItems.map((item) => (
                <div
                  key={`${item.slug}-${item.color}-${item.size}`}
                  className="flex gap-6 border-b border-neutral-200 pb-10"
                >
                  {/* IMAGE */}
                  <Link href={`/product/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={160}
                      className="object-cover"
                    />
                  </Link>

                  {/* INFOS */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="block text-lg font-medium"
                      >
                        {item.name}
                      </Link>

                      {/* VARIANTES */}
                      <p className="mt-2 text-sm text-neutral-500">
                        Couleur : <span className="font-medium">{item.color}</span>
                      </p>
                      <p className="text-sm text-neutral-500">
                        Taille : <span className="font-medium">{item.size}</span>
                      </p>

                      <p className="mt-4 text-sm font-medium">
                        {item.price} DT
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-6 text-sm">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                        className="rounded border px-3 py-1 text-sm"
                      >
                        {[...Array(item.sizeStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            Quantité {x + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeItemHandler(item)}
                        className="text-neutral-500 hover:text-black transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ---------- RÉCAPITULATIF ---------- */}
            <div className="sticky top-32 h-fit rounded-xl border border-neutral-200 p-8">
              <h2 className="mb-6 text-sm font-medium uppercase tracking-widest">
                Récapitulatif
              </h2>

              <div className="flex justify-between text-sm mb-4">
                <span>Articles</span>
                <span>
                  {cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-medium mb-8">
                <span>Total</span>
                <span>
                  {cartItems.reduce(
                    (a, c) => a + c.quantity * c.price,
                    0
                  )} DT
                </span>
              </div>

              <button
                onClick={() => router.push('/shipping')}
                className="w-full bg-black py-4 text-sm uppercase tracking-widest text-white hover:bg-neutral-900 transition"
              >
                Finaliser la commande
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });