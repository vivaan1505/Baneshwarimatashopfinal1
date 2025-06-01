import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || product.imageUrl;
  
  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{product.brand?.name || 'No Brand'}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
          {product.isNew && (
            <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
              New
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;