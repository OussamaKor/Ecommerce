import axios from 'axios';
import { useContext, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/* ---------- CATEGORY LABELS ---------- */
const CATEGORY_LABELS = {
  'sous-vetements': 'Sous-vêtements',
  'pyjamas': 'Pyjamas',
  'cap-de-bain': 'Cap de bain',
  'robe-de-chambre': 'Robe de chambre',
  'claquettes': 'Claquettes',
};

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  /* ---------- GROUP PRODUCTS BY CATEGORY ---------- */
  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || [];
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [products]);

  /* ---------- OPEN / CLOSE SECTIONS ---------- */
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  /* ---------- CART ---------- */
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <div className="min-h-screen w-full">

        {/* ---------- HERO / CAROUSEL ---------- */}
        <div className="relative w-full h-[95vh] overflow-hidden">

          {/* IMAGE avec léger zoom */}
          <img
            src="/images/profile_photo.png"
            alt="Ma&ya Douce Nuit"
            className="w-full h-full object-cover scale-105 transition-transform duration-[6000ms] hover:scale-110"
          />

          {/* Overlay dégradé plus stylé */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

          {/* CONTENU */}
          <div className="absolute inset-0 flex flex-col items-start justify-center text-left text-white px-12 md:px-24">

            <span className="uppercase tracking-[0.4em] text-sm text-neutral-300 mb-6">
              Nouvelle Collection
            </span>

            <h1 className="text-5xl md:text-7xl font-extralight leading-tight mb-6 drop-shadow-xl">
              Élégance.<br />
              Douceur.<br />
              Féminité.
            </h1>

            <p className="max-w-lg text-lg md:text-xl text-neutral-200 mb-10 leading-relaxed">
              Sublimez vos nuits avec des pièces délicates pensées pour révéler votre beauté naturelle.
            </p>
          </div>
        </div>

        {/* ---------- CONTENT ---------- */}
        <div className="container mx-auto mt-16 px-4">

          <div className="mb-12 text-center">
            <span className="mx-auto mb-4 block h-1 w-9 rounded bg-neutral-800"></span>
            <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-neutral-900">
              Tous les produits
            </h1>
          </div>

          {/* ---------- CATEGORIES ---------- */}
          {Object.entries(productsByCategory).map(
            ([category, categoryProducts]) => {
              const isOpen = openSections[category];

              return (
                <div
                  key={category}
                  id={category}
                  className="mb-16 scroll-mt-24"
                >
                  {/* HEADER */}
                  <button
                    onClick={() => toggleSection(category)}
                    className="group flex w-full items-center justify-between border-b border-neutral-300 pb-4"
                  >
                    <h2 className="text-xl font-semibold uppercase tracking-[0.15em] text-neutral-900">
                      {CATEGORY_LABELS[category] || category}
                    </h2>

                    <ChevronDownIcon
                      className={`h-5 w-5 text-neutral-600 transition-transform duration-300
                        ${isOpen ? 'rotate-180' : ''}
                      `}
                    />
                  </button>

                  {/* CONTENT */}
                  <div
                    className={`grid overflow-hidden transition-all duration-500 ease-in-out
                      ${isOpen
                        ? 'mt-8 grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                      }
                    `}
                  >
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {categoryProducts.map((product) => (
                          <ProductItem
                            key={product.slug}
                            product={product}
                            addToCartHandler={addToCartHandler}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </Layout>
  );
}

/* ---------- SSR ---------- */
export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find();
  const featuredProducts = await Product.find({ isFeatured: true });

  await db.disconnect();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
    },
  };
}
