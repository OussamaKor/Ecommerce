import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';

export default function ProductEditScreen() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);

  // Champs principaux
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Image principale (obligatoire dans ton schema)
  const [image, setImage] = useState('');

  // Couleurs / tailles
  const [colors, setColors] = useState([]);

  /* ---------------- FETCH SI EDIT ---------------- */
  useEffect(() => {
    if (!isNew && id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `/api/admin/products/${id}`
          );

          setName(data.name);
          setSlug(data.slug);
          setCategory(data.category);
          setBrand(data.brand);
          setPrice(data.price);
          setDescription(data.description);
          setImage(data.image); // important
          setColors(data.colors || []);

          setLoading(false);
        } catch (err) {
          toast.error('Erreur chargement produit');
          setLoading(false);
        }
      };

      fetchProduct();
    } else {
      // mode création
      setColors([
        {
          name: '',
          images: [],
          sizes: [{ name: '', countInStock: 0 }],
        },
      ]);
    }
  }, [id]);

  /* ---------------- UPLOAD IMAGE ---------------- */
  const uploadImageHandler = async (file, colorIndex) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post(
        '/api/admin/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const updated = [...colors];
      updated[colorIndex].images.push(data);

      // Si aucune image principale définie → on prend la première
      if (!image) {
        setImage(data);
      }

      setColors(updated);
    } catch (err) {
      toast.error('Erreur upload image');
    }
  };

  /* ---------------- SAVE ---------------- */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !slug || !price) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    if (!image) {
      toast.error('Une image principale est requise');
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      category,
      brand,
      price,
      description,
      image, // 🔥 obligatoire
      colors,
    };

    try {
      setLoading(true);

      if (isNew) {
        await axios.post(
          '/api/admin/products/create',
          payload
        );
        toast.success('Produit créé');
      } else {
        await axios.put(
          `/api/admin/products/${id}`,
          payload
        );
        toast.success('Produit modifié');
      }

      setLoading(false);
      router.push('/admin/products');
    } catch (err) {
      setLoading(false);
      toast.error(
        err.response?.data?.message || err.message
      );
    }
  };

  if (loading) return <Layout>Chargement...</Layout>;

  return (
    <Layout
      title={isNew ? 'Créer produit' : 'Modifier produit'}
    >
      <div className="min-h-screen bg-gray-50 py-10">
        <form
          onSubmit={submitHandler}
          className="mx-auto max-w-3xl bg-white p-8 rounded-xl shadow"
        >
          <h1 className="text-2xl font-semibold mb-6">
            {isNew
              ? 'Créer un produit'
              : 'Modifier le produit'}
          </h1>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <input
              className="input"
              placeholder="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              className="input"
              placeholder="Marque"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <input
              className="input"
              type="number"
              placeholder="Prix"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <textarea
            className="input mt-4"
            rows={4}
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          {/* IMAGE PRINCIPALE */}
          <div className="mt-6">
            <p className="font-medium mb-2">
              Image principale
            </p>
            {image && (
              <img
                src={image}
                alt="Main"
                className="h-24 mb-3 rounded"
              />
            )}
          </div>

          {/* COULEURS */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              Couleurs & Tailles
            </h2>

            {colors.map((color, colorIndex) => (
              <div
                key={colorIndex}
                className="border p-4 mb-4 rounded-xl"
              >
                <input
                  className="input mb-3"
                  placeholder="Couleur"
                  value={color.name}
                  onChange={(e) => {
                    const updated = [...colors];
                    updated[colorIndex].name =
                      e.target.value;
                    setColors(updated);
                  }}
                />

                <input
                  type="file"
                  onChange={(e) =>
                    uploadImageHandler(
                      e.target.files[0],
                      colorIndex
                    )
                  }
                />

                <div className="flex gap-2 mt-2">
                  {color.images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={img}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(img)}
                        className="text-xs underline block"
                      >
                        Définir principale
                      </button>
                    </div>
                  ))}
                </div>

                {color.sizes.map((size, sizeIndex) => (
                  <div
                    key={sizeIndex}
                    className="flex gap-3 mt-3"
                  >
                    <input
                      className="input flex-1"
                      placeholder="Taille"
                      value={size.name}
                      onChange={(e) => {
                        const updated = [...colors];
                        updated[colorIndex].sizes[
                          sizeIndex
                        ].name = e.target.value;
                        setColors(updated);
                      }}
                    />
                    <input
                      className="input w-28"
                      type="number"
                      placeholder="Stock"
                      value={size.countInStock}
                      onChange={(e) => {
                        const updated = [...colors];
                        updated[colorIndex].sizes[
                          sizeIndex
                        ].countInStock =
                          Number(e.target.value);
                        setColors(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button className="mt-10 w-full rounded-lg bg-black py-3 text-white hover:bg-neutral-900">
            {isNew
              ? 'Créer le produit'
              : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

ProductEditScreen.auth = { adminOnly: true };