import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  /* ---------- VARIANTS ---------- */
  const colors = product?.colors || [];
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const selectedColor = colors[selectedColorIndex];
  const sizes = selectedColor?.sizes || [];

  /* ---------- IMAGES ---------- */
  const imagesToDisplay = useMemo(() => {
    if (!product) return [];
    if (!colors.length) return [product.image];
    return selectedColor?.images?.length
      ? selectedColor.images
      : [product.image];
  }, [colors, selectedColor, product]);

  /* ---------- CAROUSEL ---------- */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColorIndex]);

  useEffect(() => {
    setSelectedSize(null);
  }, [selectedColorIndex]);

  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imagesToDisplay.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesToDisplay.length - 1 : prev - 1
    );
  };

  /* ---------- CART ---------- */
  const addToCartHandler = async () => {
    if (!selectedSize) {
      return toast.error('Please select a size');
    }

    const existItem = state.cart.cartItems.find(
      (x) =>
        x.slug === product.slug &&
        x.color === selectedColor.name &&
        x.size === selectedSize.name
    );

    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (selectedSize.countInStock < quantity) {
      return toast.error('Sorry. This size is out of stock');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...product,
        quantity,
        color: selectedColor.name,
        size: selectedSize.name,
        sizeStock: selectedSize.countInStock,
      },
    });

    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="container mx-auto px-4 py-12">

        {/* BACK */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          <span>Back to shop</span>
        </Link>

        <div className="rounded-2xl bg-neutral-50 shadow-sm p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* ---------- LEFT : CAROUSEL ---------- */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 group">

              <Image
                src={imagesToDisplay[currentImageIndex]}
                alt={`${product.name}-${currentImageIndex}`}
                fill
                className="object-cover transition duration-300"
                priority
              />

              {imagesToDisplay.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2
                               rounded-full bg-white/80 p-2 shadow
                               opacity-0 group-hover:opacity-100
                               transition hover:bg-white"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               rounded-full bg-white/80 p-2 shadow
                               opacity-0 group-hover:opacity-100
                               transition hover:bg-white"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {imagesToDisplay.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {imagesToDisplay.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition
                        ${
                          index === currentImageIndex
                            ? 'bg-black'
                            : 'bg-black/30'
                        }
                      `}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ---------- RIGHT : INFO ---------- */}
            <div className="flex flex-col justify-center gap-8 bg-white p-10 rounded-xl">

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {product.brand}
                </p>
                <h1 className="mt-2 text-3xl font-light tracking-wide">
                  {product.name}
                </h1>
              </div>

              <p className="text-gray-500 leading-relaxed">
                {product.description}
              </p>

              {/* SIZE */}
              <div className="flex items-center gap-6">
                <span className="w-24 text-sm text-gray-600">Size</span>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size.name}
                      disabled={size.countInStock === 0}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md border text-sm transition
                        ${
                          selectedSize?.name === size.name
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300'
                        }
                        ${
                          size.countInStock === 0
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:border-black'
                        }
                      `}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLORS */}
              {colors.length > 0 && (
                <div className="flex items-center gap-6">
                  <span className="w-24 text-sm text-gray-600">Color</span>
                  <div className="flex gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColorIndex(index)}
                        title={color.name}
                        className={`h-6 w-6 rounded-full ring-2 transition
                          ${
                            selectedColorIndex === index
                              ? 'ring-black'
                              : 'ring-gray-300'
                          }
                        `}
                        style={{
                          backgroundColor: color.name.toLowerCase(),
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* PRICE & STOCK */}
              <div className="flex items-center gap-6">
                <span className="text-3xl font-medium">
                  {product.price} DT
                </span>

                {selectedSize ? (
                  selectedSize.countInStock > 0 ? (
                    <span className="text-sm text-green-600">
                      In stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600">Out of stock</span>
                  )
                ) : (
                  <span className="text-sm text-gray-400">
                    Choose a size
                  </span>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={addToCartHandler}
                disabled={!selectedSize || selectedSize.countInStock === 0}
                className={`rounded-md py-4 text-sm uppercase tracking-widest text-white
                  ${
                    !selectedSize || selectedSize.countInStock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-neutral-900'
                  }
                `}
              >
                Add to cart
              </button>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ---------- SSR ---------- */
export async function getServerSideProps(context) {
  const { slug } = context.params;

  await db.connect();
  const product = await Product.findOne({ slug });
  await db.disconnect();

  return {
    props: {
      product: product ? JSON.parse(JSON.stringify(product)) : null,
    },
  };
}
