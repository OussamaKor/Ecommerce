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
        <div className="relative w-full h-[70vh] md:h-[85vh] lg:h-[95vh] overflow-hidden">

          {/* IMAGE DESKTOP (caché sur mobile) */}
          <img
            src="/images/profile_photo.png"
            alt="Ma&ya Douce Nuit"
            className="hidden md:block w-full h-full object-cover scale-105 transition-transform duration-[6000ms] hover:scale-110"
          />

          {/* IMAGE MOBILE (caché sur desktop) */}
          <img
            src="/images/profile_mobile.png"
            alt="Ma&ya Douce Nuit"
            className="block md:hidden w-full h-full object-cover object-center"
          />

          {/* Overlay dégradé plus stylé */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

          {/* CONTENU */}
          <div className="absolute inset-0 flex flex-col items-start justify-center text-white px-6 sm:px-10 md:px-16 lg:px-20">

            {/* Small accent line */}
            <div className="w-12 h-[2px] bg-white/80 mb-6 md:mb-8"></div>

            {/* Main title - elegant and readable */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                          font-light tracking-tight leading-[1.1] 
                          mb-6 md:mb-8
                          [text-shadow:_0_2px_20px_rgb(0_0_0_/_60%)]">
              Élégance.<br />
              Douceur.<br />
              Féminité.
            </h1>

            {/* Subtitle - clean and minimal */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl 
                        text-white/90 font-light leading-relaxed
                        mb-8 md:mb-12 max-w-xl
                        [text-shadow:_0_1px_10px_rgb(0_0_0_/_50%)]">
              Sublimez vos nuits avec des pièces délicates<br className="hidden sm:block" />
              pensées pour révéler votre beauté naturelle.
            </p>

            {/* CTA Button - minimal and elegant */}
            <a 
              href="#produits" 
              className="group inline-flex items-center gap-2
                       text-sm sm:text-base tracking-wider uppercase
                       text-white font-light
                       border-b-2 border-white/60
                       pb-2 
                       hover:border-white
                       transition-all duration-300">
              Découvrir la collection
              <svg 
                className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

          </div>
        </div>

        {/* ---------- CONTENT ---------- */}
        <div id="produits" className="container mx-auto mt-16 px-4 scroll-mt-8">

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
