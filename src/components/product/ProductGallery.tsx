
import React from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

export const ProductGallery = ({ image, name }: ProductGalleryProps) => {
  return (
    <div className="lg:w-1/2 mb-6 lg:mb-0">
      <img
        src={image}
        alt={name}
        className="w-full h-auto rounded-md"
      />
    </div>
  );
};
