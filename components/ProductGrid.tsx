import React from 'react';
import ProductCard from './ProductCard';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image?: string;
}

const dummyProducts: Product[] = [
  { id: '1', name: 'Product Name', price: 29.99, rating: 4.7 },
  { id: '2', name: 'Product Name', price: 39.99, rating: 4.2 },
  { id: '3', name: 'Product Name', price: 19.99, rating: 3.1 },
  { id: '4', name: 'Product Name', price: 49.99, rating: 4.6 },
  { id: '5', name: 'Product Name', price: 24.99, rating: 3.8 },
  { id: '6', name: 'Product Name', price: 34.99, rating: 4.5 },
  { id: '7', name: 'Product Name', price: 44.99, rating: 4.1 },
  { id: '8', name: 'Product Name', price: 54.99, rating: 4.9 },
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