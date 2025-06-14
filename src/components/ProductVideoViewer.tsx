
import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Video } from 'lucide-react';
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
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gradient-to-r from-purple-500/10 via-purple-400/15 to-purple-500/10 hover:from-purple-500/20 hover:via-purple-400/30 hover:to-purple-500/20 text-white border border-purple-400/30 hover:border-purple-300/70 rounded-lg transition-all duration-500 hover:scale-[1.08] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 overflow-hidden transform hover:-translate-y-0.5"
      >
        {/* Animated background waves */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/30 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-pink-400/0 via-pink-300/20 to-pink-400/0 translate-x-[100%] group-hover:translate-x-[-200%] transition-transform duration-1200 ease-in-out delay-100"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1 left-2 w-1 h-1 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-200"></div>
        <div className="absolute bottom-1 right-3 w-1 h-1 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-300"></div>
        <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-purple-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500 delay-400"></div>
        
        <Video className="w-3.5 h-3.5 transition-all duration-500 group-hover:scale-125 group-hover:rotate-[-360deg] group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] relative z-10" />
        <span className="relative z-10 transition-all duration-500 group-hover:text-purple-100 group-hover:font-semibold group-hover:tracking-wide">الفيديوهات ({videos.length})</span>
        
        {/* Pulsing indicator */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-ping"></div>
        
        {/* Corner sparkles */}
        <div className="absolute -top-0.5 -left-0.5 w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
          <div className="w-full h-full bg-gradient-to-br from-purple-300 to-pink-300 rounded-full animate-spin"></div>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
          <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300 rounded-full animate-spin"></div>
        </div>
      </button>

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
