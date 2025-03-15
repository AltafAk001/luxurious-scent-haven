
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star } from "lucide-react";

interface ProductReviewsProps {
  id: number;
}

export const ProductReviews = ({ id }: ProductReviewsProps) => {
  // Mock reviews data (would be fetched from API in real app)
  const reviews = [
    {
      id: 1,
      author: "Sarah J.",
      rating: 5,
      date: "March 15, 2023",
      content: "Absolutely love this fragrance! Long lasting and the scent is perfect for everyday wear.",
    },
    {
      id: 2,
      author: "Michael T.",
      rating: 4,
      date: "February 28, 2023",
      content: "Great scent, but doesn't last quite as long as I'd like. Still, very pleased with my purchase.",
    },
    {
      id: 3,
      author: "Priya K.",
      rating: 5,
      date: "January 12, 2023",
      content: "Received so many compliments when wearing this perfume. Absolutely worth the price!",
    },
  ];

  return (
    <div className="py-8 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
      
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <span className="text-gray-600">Based on {reviews.length} reviews</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium">{review.author}</span>
                <span className="text-gray-500 ml-2">- {review.date}</span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
