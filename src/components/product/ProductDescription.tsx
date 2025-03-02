
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductDescriptionProps {
  product: {
    description?: string;
    category?: string;
    brand: string;
    inStock: boolean;
    sizes?: string[];
  };
}

export const ProductDescription = ({ product }: ProductDescriptionProps) => {
  return (
    <div className="py-8">
      <Accordion type="single" collapsible>
        <AccordionItem value="description">
          <AccordionTrigger className="uppercase font-semibold">Description</AccordionTrigger>
          <AccordionContent>
            {product.description}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="details">
          <AccordionTrigger className="uppercase font-semibold">Details</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5">
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>In Stock: {product.inStock ? 'Yes' : 'No'}</li>
              {product.sizes && product.sizes.length > 0 && (
                <li>Sizes: {product.sizes.join(', ')}</li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping">
          <AccordionTrigger className="uppercase font-semibold">Shipping & Returns</AccordionTrigger>
          <AccordionContent>
            <p>
              We offer free shipping on all orders over £50. Returns are accepted within 30 days of purchase.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
