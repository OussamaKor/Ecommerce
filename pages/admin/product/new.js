import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import categories from '../../../utils/categories';

export default function ProductCreateScreen() {
    const router = useRouter();

    /* ---------- INFOS DE BASE ---------- */
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    /* ---------- COULEURS / TAILLES ---------- */
    const [colors, setColors] = useState([
        {
            name: '',
            images: [],
            sizes: [{ name: '', countInStock: 0 }],
        },
    ]);

    /* ---------- UPLOAD IMAGE ---------- */
    const uploadImageHandler = async (file, colorIndex) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const updated = [...colors];
            updated[colorIndex].images.push(data);
            setColors(updated);
        } catch (err) {
            toast.error('Erreur lors de l’upload de l’image');
        }
    };

    /* ---------- SUBMIT ---------- */
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !slug || !price || colors.length === 0) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            const { data } = await axios.post('/api/admin/products/create', {
                name,
                slug,
                category,
                brand,
                price,
                description,
                colors,
            });

            toast.success('Produit créé avec succès');
            router.push(`/admin/product/${data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <Layout title="Créer un produit">
            <div className="min-h-screen bg-gray-50 py-10">
                <form
                    onSubmit={submitHandler}
                    className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow"
                >
                    <h1 className="mb-8 text-2xl font-semibold">
                        Créer un nouveau produit
                    </h1>

                    {/* ---------- INFOS PRODUIT ---------- */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="input"
                            placeholder="Nom du produit *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="input"
                            placeholder="Slug (url) *"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                        <select
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">— Choisir une catégorie —</option>
                            {categories.map((cat) => (
                                <option key={cat.key} value={cat.key}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <input
                            className="input"
                            placeholder="Marque"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                        <input
                            className="input"
                            type="number"
                            placeholder="Prix (DT) *"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <textarea
                        className="input mt-4"
                        rows={4}
                        placeholder="Description du produit"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* ---------- COULEURS ---------- */}
                    <div className="mt-8">
                        <h2 className="mb-4 text-lg font-semibold">
                            Couleurs, tailles et stock
                        </h2>

                        {colors.map((color, colorIndex) => (
                            <div
                                key={colorIndex}
                                className="mb-6 rounded-xl border p-4"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    {/* COLOR PICKER */}
                                    <input
                                        type="color"
                                        value={color.name || '#000000'}
                                        onChange={(e) => {
                                            const updated = [...colors];
                                            updated[colorIndex].name = e.target.value; // on stocke le HEX ici
                                            setColors(updated);
                                        }}
                                        className="h-12 w-16 cursor-pointer border-none bg-transparent"
                                    />

                                    {/* PREVIEW */}
                                    <div
                                        className="h-10 w-10 rounded-full border shadow"
                                        style={{ backgroundColor: color.name }}
                                    />

                                    <span className="text-sm text-gray-600">
                                        {color.name}
                                    </span>
                                </div>

                                {/* IMAGES */}
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        uploadImageHandler(e.target.files[0], colorIndex)
                                    }
                                    className="mb-3"
                                />

                                <div className="flex gap-2 mb-4">
                                    {color.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt="preview"
                                            className="h-16 w-16 rounded object-cover"
                                        />
                                    ))}
                                </div>

                                {/* TAILLES */}
                                <div className="space-y-3">
                                    {color.sizes.map((size, sizeIndex) => (
                                        <div
                                            key={sizeIndex}
                                            className="flex gap-3 items-center"
                                        >
                                            <input
                                                className="input flex-1"
                                                placeholder="Taille (ex : S, M, 38)"
                                                value={size.name}
                                                onChange={(e) => {
                                                    const updated = [...colors];
                                                    updated[colorIndex].sizes[sizeIndex].name =
                                                        e.target.value;
                                                    setColors(updated);
                                                }}
                                            />
                                            <input
                                                className="input w-32"
                                                type="number"
                                                placeholder="Stock"
                                                value={size.countInStock}
                                                onChange={(e) => {
                                                    const updated = [...colors];
                                                    updated[colorIndex].sizes[sizeIndex].countInStock =
                                                        Number(e.target.value);
                                                    setColors(updated);
                                                }}
                                            />
                                            {color.sizes.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="text-sm text-red-500"
                                                    onClick={() => {
                                                        const updated = [...colors];
                                                        updated[colorIndex].sizes = updated[
                                                            colorIndex
                                                        ].sizes.filter((_, i) => i !== sizeIndex);
                                                        setColors(updated);
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="mt-3 text-sm text-stone-600 underline"
                                    onClick={() => {
                                        const updated = [...colors];
                                        updated[colorIndex].sizes.push({
                                            name: '',
                                            countInStock: 0,
                                        });
                                        setColors(updated);
                                    }}
                                >
                                    + Ajouter une taille
                                </button>

                                {colors.length > 1 && (
                                    <button
                                        type="button"
                                        className="mt-4 block text-sm text-red-500 underline"
                                        onClick={() =>
                                            setColors(colors.filter((_, i) => i !== colorIndex))
                                        }
                                    >
                                        Supprimer cette couleur
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() =>
                                setColors([
                                    ...colors,
                                    {
                                        name: '',
                                        images: [],
                                        sizes: [{ name: '', countInStock: 0 }],
                                    },
                                ])
                            }
                            className="default-button"
                        >
                            + Ajouter une couleur
                        </button>
                    </div>

                    <button className="mt-10 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]">
                        Créer le produit
                    </button>

                </form>
            </div>
        </Layout>
    );
}

ProductCreateScreen.auth = { adminOnly: true };
