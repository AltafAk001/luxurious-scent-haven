
import React, { useState } from 'react';
import { Heart, Check, Store } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProductGallery } from '../components/ProductGallery';
import { Button } from '../components/ui/button';

interface SizeOption {
  size: string;
  price: number;
  volume: string;
}

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState<SizeOption>({
    size: '50ml',
    price: 59.00,
    volume: '£118.00/100ml'
  });
  
  const product = {
    id: 'issey-miyake-leau-dissey-intense',
    brand: 'ISSEY MIYAKE',
    name: "L'EAU D'ISSEY POUR HOMME INTENSE EAU DE TOILETTE 50ML",
    rating: 4.5,
    reviews: 126,
    stockStatus: 'IN STOCK',
    sizes: [
      { size: '50ml', price: 59.00, volume: '£118.00/100ml' },
      { size: '100ml', price: 80.00, volume: '£80.00/100ml' },
    ],
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4a9d49e1f90?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1563170423-18f482413a13?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3',
    ],
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Brands', href: '/brands' },
      { label: 'Issey Miyake', href: '/brands/issey-miyake' },
      { label: "L'Eau d'Issey Pour Homme Eau de Cèdre", href: '#', isCurrent: true },
    ]
  };

  const handleSizeSelect = (size: SizeOption) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', product.name, selectedSize);
    // Add to cart functionality would go here
  };

  const handleAddToWishlist = () => {
    console.log('Adding to wishlist:', product.name);
    // Add to wishlist functionality would go here
  };

  // Generate stars for rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Math.floor(rating)
                  ? 'text-primary'
                  : star - 0.5 <= rating
                  ? 'text-primary'
                  : 'text-secondary'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-button-sm text-secondary-medium ml-1">
          {rating} · {product.reviews} reviews
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Breadcrumb navigation */}
      <Breadcrumb items={product.breadcrumbs} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Product Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>
        
        {/* Product Information */}
        <div>
          <div className="mb-6">
            <h3 className="text-button-lg text-secondary-medium uppercase mb-1">{product.brand}</h3>
            <h1 className="text-h2 uppercase mb-3">{product.name}</h1>
            
            {/* Rating */}
            <div className="mb-3">
              {renderRating(product.rating)}
            </div>
            
            {/* Price */}
            <p className="text-h2 mb-6">£{selectedSize.price.toFixed(2)}</p>
            
            {/* Size Options */}
            <div className="mb-6">
              <div className="mb-2">
                <span className="text-body-2">Size</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => handleSizeSelect(size)}
                    className={`flex flex-col items-center justify-center border p-3 ${
                      selectedSize.size === size.size
                        ? 'border-primary'
                        : 'border-secondary hover:border-secondary-medium'
                    }`}
                  >
                    <span className="text-h4">£{size.price.toFixed(2)}</span>
                    <span className="text-button-sm text-secondary-medium">
                      {size.size} ({size.volume})
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <Check size={18} className="text-contrast-green" />
              <span className="text-body-2 text-primary uppercase">{product.stockStatus}</span>
              
              <button className="flex items-center gap-1 ml-auto text-button-sm text-secondary-dark hover:text-primary">
                <Store size={16} />
                <span>CHECK STORE STOCK</span>
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                variant="dark" 
                size="xl" 
                width="full"
                onClick={handleAddToCart}
              >
                CHECKOUT NOW
              </Button>
              
              <Button 
                variant="light" 
                size="xl" 
                width="full"
                onClick={handleAddToCart}
              >
                ADD TO BAG
              </Button>
              
              <button 
                onClick={handleAddToWishlist}
                className="flex items-center justify-end gap-1 w-full text-button-sm text-secondary-dark hover:text-primary transition-colors p-2"
              >
                <Heart size={18} />
                <span>ADD TO WISHLIST</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
