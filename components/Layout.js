import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import { FaInstagram } from 'react-icons/fa';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import categories from '../utils/categories';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-20 items-center justify-between px-6 shadow-md bg-[#FCFCFA]">

            {/* LOGO */}
            <Link href="/" className="group flex flex-col leading-none">
              <span className="font-script text-3xl text-brandGold tracking-wide">
                Maya Style
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                Douce nuit
              </span>
            </Link>

            {/* CATEGORIES */}
            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-neutral-600">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/#${cat.key}`}
                  className="hover:text-black transition"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex items-center z-10 gap-2">

              {/* CART */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 text-neutral-700 hover:text-black transition"
              >
                <ShoppingBagIcon className="h-6 w-6" />

                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* AUTH / ADMIN */}
              {isAdminRoute && (
                <>
                  {status === 'loading' ? null : session?.user ? (
                    <Menu as="div" className="relative inline-block">
                      <Menu.Button className="text-sm text-neutral-700 hover:text-black transition">
                        {session.user.name}
                      </Menu.Button>

                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white shadow-lg rounded-md">
                        <Menu.Item>
                          <DropdownLink href="/profile">Profile</DropdownLink>
                        </Menu.Item>

                        <Menu.Item>
                          <DropdownLink href="/order-history">
                            Order History
                          </DropdownLink>
                        </Menu.Item>

                        {session.user.isAdmin && (
                          <Menu.Item>
                            <DropdownLink href="/admin/dashboard">
                              Admin Dashboard
                            </DropdownLink>
                          </Menu.Item>
                        )}

                        <Menu.Item>
                          <button
                            className="dropdown-link w-full text-left"
                            onClick={logoutClickHandler}
                          >
                            Logout
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  ) : (
                    <Link href="/login" className="p-2 text-sm text-neutral-700">
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="flex-1 h-12">{children}</main>
        <footer className="mt-10 border-t border-neutral-200 bg-[#FCFCFA]">
          <div className="mx-auto max-w-7xl px-6 py-14">

            {/* TOP */}
            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 text-center">

              {/* subtle pattern */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px]" />

              {/* BRAND */}
              <div className="relative">
                <Link href="/" className="group flex flex-col leading-none">
                  <span className="font-script text-3xl text-brandGold tracking-wide">
                    Maya Style
                  </span>

                  <span className="mt-1 text-[10px] font-sans uppercase tracking-[0.35em] text-neutral-500">
                    Douce nuit
                  </span>
                </Link>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  Nabeul
                </p>
              </div>

              {/* CONTACT */}
              <div className="relative">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Contact
                </h3>
                <p className="mt-4 text-sm text-neutral-700">
                  Téléphone : <span className="font-medium">+216 25 065 628</span>
                </p>
              </div>

              {/* SOCIAL */}
              <div className="relative">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Follow us
                </h3>

                <a
                  href="https://www.instagram.com/mayastyle.officie"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition"
                >
                  <FaInstagram size={18} />
                  Instagram
                </a>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-14 border-t border-neutral-300 pt-6 text-center text-xs text-neutral-500">
              © {new Date().getFullYear()} Nom d&apos;entreprise — Built by{' '}
              <a
                href="https://www.instagram.com/oussama__kor?igsh=MjUyOTB4c3BtZm51"
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-neutral-900 transition"
              >
                Oussama Kordoghli
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
