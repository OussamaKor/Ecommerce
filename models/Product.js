import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },

    image: { type: String, required: true },

    // 🎨 Couleurs → 📏 Tailles → 📦 Stock
    colors: [
      {
        name: { type: String, required: true }, // ex: "Noir"
        images: [{ type: String, required: true }],

        sizes: [
          {
            name: { type: String, required: true }, // ex: "S", "M", "L", "42"
            countInStock: { type: Number, required: true, default: 0 },
          },
        ],
      },
    ],

    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;