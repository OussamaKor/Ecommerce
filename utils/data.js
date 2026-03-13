import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: 'Free Shirt',
      slug: 'free-shirt',
      category: 'sous-vetements',
      image: '/images/shirt1.jpg',
      price: 70,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 8,
      description: 'A popular shirt',
      isFeatured: true,
      banner: '/images/banner3.webp',

      colors: [
        {
          name: 'Black',
          images: ['/images/shirt1.jpg'],
          sizes: [
            { name: 'S', countInStock: 5 },
            { name: 'M', countInStock: 8 },
            { name: 'L', countInStock: 7 },
          ],
        },
      ],
    },

    {
      name: 'Claquette en coton',
      slug: 'claquette-coton',
      category: 'claquettes',
      image: '/images/claquette-beige-1.jpg',
      price: 39,
      brand: 'Zara',
      description: 'Pyjama confortable en coton',

      colors: [
        {
          name: 'Beige',
          images: [
            '/images/claquette-beige-1.jpg',
            '/images/claquette-beige-2.jpg',
            '/images/claquette-beige-3.jpg',
          ],
          sizes: [
            { name: '36', countInStock: 3 },
            { name: '38', countInStock: 4 },
            { name: '40', countInStock: 2 },
          ],
        },
        {
          name: 'Black',
          images: [
            '/images/claquette-noir-1.jpg',
            '/images/claquette-noir-2.jpg',
            '/images/claquette-noir-3.jpg',
          ],
          sizes: [
            { name: '36', countInStock: 2 },
            { name: '38', countInStock: 1 },
            { name: '40', countInStock: 0 },
          ],
        },
        {
          name: 'Tan',
          images: ['/images/claquette-marron-1.jpg'],
          sizes: [
            { name: '38', countInStock: 2 },
          ],
        },
      ],
    },

    {
      name: 'Fit Shirt',
      slug: 'fit-shirt',
      category: 'cap-de-bain',
      image: '/images/shirt2.jpg',
      price: 80,
      brand: 'Adidas',
      rating: 3.2,
      numReviews: 10,
      description: 'A popular shirt',
      isFeatured: true,
      banner: '/images/banner3.webp',

      colors: [
        {
          name: 'Blue',
          images: ['/images/shirt2.jpg'],
          sizes: [
            { name: 'S', countInStock: 6 },
            { name: 'M', countInStock: 5 },
            { name: 'L', countInStock: 9 },
          ],
        },
      ],
    },

    {
      name: 'Slim Shirt',
      slug: 'slim-shirt',
      category: 'pyjamas',
      image: '/images/shirt3.jpg',
      price: 90,
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 3,
      description: 'A popular shirt',

      colors: [
        {
          name: 'White',
          images: ['/images/shirt3.jpg'],
          sizes: [
            { name: 'M', countInStock: 10 },
            { name: 'L', countInStock: 5 },
          ],
        },
      ],
    },

    {
      name: 'Golf Pants',
      slug: 'golf-pants',
      category: 'sous-vetements',
      image: '/images/pants1.jpg',
      price: 90,
      brand: 'Oliver',
      rating: 2.9,
      numReviews: 13,
      description: 'Smart looking pants',

      colors: [
        {
          name: 'Grey',
          images: ['/images/pants1.jpg'],
          sizes: [
            { name: 'M', countInStock: 8 },
            { name: 'L', countInStock: 12 },
          ],
        },
      ],
    },

    {
      name: 'Fit Pants',
      slug: 'fit-pants',
      category: 'cap-de-bain',
      image: '/images/pants2.jpg',
      price: 95,
      brand: 'Zara',
      rating: 3.5,
      numReviews: 7,
      description: 'A popular pants',

      colors: [
        {
          name: 'Black',
          images: ['/images/pants2.jpg'],
          sizes: [
            { name: 'M', countInStock: 10 },
            { name: 'L', countInStock: 6 },
          ],
        },
      ],
    },

    {
      name: 'Classic Pants',
      slug: 'classic-pants',
      category: 'robe-de-chambre',
      image: '/images/pants3.jpg',
      price: 75,
      brand: 'Casely',
      rating: 2.4,
      numReviews: 14,
      description: 'A popular pants',

      colors: [
        {
          name: 'Brown',
          images: ['/images/pants3.jpg'],
          sizes: [
            { name: 'M', countInStock: 7 },
            { name: 'L', countInStock: 13 },
          ],
        },
      ],
    },
  ],
};

export default data;
