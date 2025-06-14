
import React, { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductImageViewerProps {
  images: string[];
  productName: string;
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({ images, productName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-blue-400/60 rounded-lg transition-all duration-300 hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-blue-500/50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
        <Image className="w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 relative z-10" />
        <span className="relative z-10 transition-all duration-300 group-hover:text-blue-200">الصور ({images.length})</span>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-center">{productName} - الصور</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <div className="flex items-center justify-center bg-black/50 rounded-lg p-4 min-h-[400px]">
              <img
                src={images[currentImageIndex]}
                alt={`${productName} - صورة ${currentImageIndex + 1}`}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            {images.length > 1 && (
              <>
                <Button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 justify-center mt-4 max-h-20 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`صورة مصغرة ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImageViewer;
