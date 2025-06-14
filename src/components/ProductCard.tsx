
import React from 'react';
import { ShoppingCart, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../types/admin';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getTitleSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'text-lg';
      case 'medium': return 'text-xl';
      case 'large': return 'text-2xl';
      case 'xl': return 'text-3xl';
      default: return 'text-xl';
    }
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
      style={{ backgroundColor: product.backgroundColor }}
    >
      {/* Product Images */}
      {product.images && product.images.length > 0 && (
        <div className="relative h-48 bg-gray-800">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.images.length > 1 && (
            <Badge className="absolute top-2 right-2 bg-black/50">
              <ImageIcon className="w-3 h-3 mr-1" />
              {product.images.length}
            </Badge>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Product Title */}
        <h3 className={`font-bold text-white mb-3 ${getTitleSizeClass(product.titleSize)}`}>
          {product.name}
        </h3>

        {/* Product Description */}
        <p className={`text-gray-300 mb-4 ${getSizeClass(product.textSize)}`}>
          {product.description}
        </p>

        {/* Product Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">المميزات:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Product Videos */}
        {product.videos && product.videos.length > 0 && (
          <div className="mb-4">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Play className="w-3 h-3 mr-1" />
              {product.videos.length} فيديو
            </Badge>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">{product.price}</span>
            <span className="text-sm text-gray-400 mr-1">ريال</span>
          </div>
          <Button 
            onClick={onAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            إضافة للسلة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
