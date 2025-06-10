
import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductVideoViewerProps {
  videos: string[];
  productName: string;
}

const ProductVideoViewer: React.FC<ProductVideoViewerProps> = ({ videos, productName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  if (!videos || videos.length === 0) {
    return null;
  }

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
      >
        <Play className="w-4 h-4" />
        عرض الفيديوهات ({videos.length})
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-center">{productName} - الفيديوهات</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <div className="flex items-center justify-center bg-black/50 rounded-lg p-4 min-h-[400px]">
              <video
                src={videos[currentVideoIndex]}
                controls
                className="max-w-full max-h-[60vh] rounded-lg"
              >
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>

            {videos.length > 1 && (
              <>
                <Button
                  onClick={prevVideo}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={nextVideo}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentVideoIndex + 1} / {videos.length}
            </div>
          </div>

          {videos.length > 1 && (
            <div className="flex gap-2 justify-center mt-4 max-h-20 overflow-x-auto">
              {videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                    index === currentVideoIndex ? 'border-purple-500' : 'border-gray-300'
                  }`}
                >
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    muted
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

export default ProductVideoViewer;
