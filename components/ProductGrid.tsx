import ProductCard from './ProductCard';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image?: string;
}

const dummyProducts: Product[] = [
  { id: '1', 
    name: 'iPhone 15 Pro Max', 
    price: 1199.99, 
    rating: 4.8,
    image: '/products/iphone-15-pro.png' },
  { id: '2', 
    name: 'Samsung Galaxy S24 Ultra', 
    price: 1299.99, 
    rating: 4.7,
    image: '/products/samsung.png' },
  { 
    id: '3', 
    name: 'Sony WH-1000XM5 Headphones', 
    price: 399.99, 
    rating: 4.9,
    image: '/products/earphones.png'
  },
  { 
    id: '4', 
    name: 'MacBook Air M3', 
    price: 1299.99, 
    rating: 4.8,
    image: '/products/laptop.png'
  },
  { 
    id: '5', 
    name: 'Apple Watch Series 9', 
    price: 429.99, 
    rating: 4.6,
    image: '/products/watch.png'
  },
  { 
    id: '6', 
    name: 'Nike Air Max 270', 
    price: 159.99, 
    rating: 4.5,
    image: '/products/nike.png'
  },
  { 
    id: '7', 
    name: 'Adidas Ultraboost 23', 
    price: 189.99, 
    rating: 4.7,
    image: '/products/shoes.png'
  },
  { 
    id: '8', 
    name: 'Canon EOS R6 Mark II', 
    price: 2499.99, 
    rating: 4.9,
    image: '/products/camera.png'
  },
];

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 min-[250px]:grid-cols-2 min-[500px]:grid-cols-3 gap-4 p-4">
      {dummyProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}