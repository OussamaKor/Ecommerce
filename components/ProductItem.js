/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { HeartIcon, EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="group relative rounded-xl border bg-white shadow-sm transition hover:shadow-lg">
      
      {/* IMAGE + ACTIONS */}
      <div className="relative overflow-hidden rounded-t-xl">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* ACTIONS OVERLAY */}
        <div className="absolute left-3 top-3 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
          <button className="rounded-full bg-white p-2 shadow hover:bg-gray-100">
            <HeartIcon className="h-5 w-5" />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="rounded-full bg-white p-2 shadow hover:bg-gray-100"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => addToCartHandler(product)}
            className="rounded-full bg-white p-2 shadow hover:bg-gray-100"
          >
            <ShoppingCartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* TEXTE */}
      <div className="p-4 text-left">
        <p className="text-sm text-amber-600">Gamme Capillaire</p>
        <h3 className="mt-1 text-base font-semibold">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold">
          {product.price} DT
        </p>
      </div>
    </div>
  );
}