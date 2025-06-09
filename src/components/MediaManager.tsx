import React, { useState } from 'react';
import { Plus, X, Upload, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaManagerProps {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  images,
  videos,
  onImagesChange,
  onVideosChange
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          onImagesChange([...images, imageData]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const videoData = e.target?.result as string;
          onVideosChange([...videos, videoData]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const removeVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    onVideosChange(updatedVideos);
  };

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <div>
        <label className="block text-gray-400 text-sm mb-3">صور المنتج</label>
        
        {/* Existing Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded border border-white/20"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Images */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="images-upload"
          />
          <label
            htmlFor="images-upload"
            className="flex items-center justify-center w-full p-3 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
          >
            <Upload className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-400">إضافة صور</span>
          </label>
        </div>
      </div>

      {/* Videos Section */}
      <div>
        <label className="block text-gray-400 text-sm mb-3">فيديوهات المنتج</label>
        
        {/* Existing Videos */}
        {videos.length > 0 && (
          <div className="space-y-3 mb-3">
            {videos.map((video, index) => (
              <div key={index} className="relative group border border-white/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Video className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-gray-300">فيديو {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVideo(index)}
                    className="p-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <video 
                  src={video} 
                  className="w-full h-32 object-cover rounded mt-2"
                  controls
                />
              </div>
            ))}
          </div>
        )}

        {/* Add Videos */}
        <div className="relative">
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            className="hidden"
            id="videos-upload"
          />
          <label
            htmlFor="videos-upload"
            className="flex items-center justify-center w-full p-3 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
          >
            <Upload className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-400">إضافة فيديوهات</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MediaManager;
