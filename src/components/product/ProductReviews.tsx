
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const ProductReviews = () => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
      {/* Review Form */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Add a Review</Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Write a Review</SheetTitle>
            <SheetDescription>
              Share your thoughts about this product with other customers.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Kristin Thomas" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value="kristin.thomas@example.com" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="review" className="text-right mt-2">
                Review
              </Label>
              <Textarea id="review" className="col-span-3" />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mock Reviews */}
      <div className="mt-6">
        <div className="mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-500 ml-2">By John Doe on January 1, 2023</span>
          </div>
          <p className="text-gray-700">
            "This is a great product! I love the smell and it lasts all day."
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 5 ? 'text-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-500 ml-2">By Jane Smith on February 15, 2023</span>
          </div>
          <p className="text-gray-700">
            "Excellent product! Fast shipping and great customer service."
          </p>
        </div>
      </div>
    </div>
  );
};
