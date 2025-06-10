
import React, { useState } from 'react';
import { Plus, X, Upload, Video } from 'lucide-react';
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
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      try {
        // تحسين جودة الصورة لتقليل الحجم
        const compressedImage = await compressImage(file, 0.7);
        newImages.push(compressedImage);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
    }
    
    setIsUploading(false);
    // مسح قيمة input
    event.target.value = '';
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newVideos: string[] = [];

    for (const file of Array.from(files)) {
      try {
        // تحسين جودة الفيديو لتقليل الحجم
        const compressedVideo = await compressVideo(file, 0.6);
        newVideos.push(compressedVideo);
      } catch (error) {
        console.error('Error processing video:', error);
      }
    }

    if (newVideos.length > 0) {
      const updatedVideos = [...videos, ...newVideos];
      onVideosChange(updatedVideos);
    }
    
    setIsUploading(false);
    // مسح قيمة input
    event.target.value = '';
  };

  // دالة ضغط الصور
  const compressImage = (file: File, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.onload = () => {
        // تحديد أقصى أبعاد للصورة
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        // تقليل الأبعاد إذا كانت كبيرة
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // دالة ضغط الفيديوهات (تحويل لـ base64 مع تقليل الجودة)
  const compressVideo = (file: File, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = Math.min(video.videoWidth, 640);
        canvas.height = Math.min(video.videoHeight, 480);
        
        video.currentTime = 0;
        video.onseeked = () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // نأخذ إطار واحد فقط كصورة مصغرة
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(thumbnailDataUrl);
          } else {
            // إذا فشل في إنشاء المعاينة، نستخدم الفيديو الأصلي
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read video'));
            reader.readAsDataURL(file);
          }
        };
      };

      video.onerror = () => {
        // في حالة فشل معالجة الفيديو، نستخدم FileReader
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read video'));
        reader.readAsDataURL(file);
      };

      video.src = URL.createObjectURL(file);
    });
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
        <label className="block text-gray-400 text-sm mb-3">
          صور المنتج ({images.length})
        </label>
        
        {/* Existing Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3 max-h-64 overflow-y-auto">
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
            disabled={isUploading}
          />
          <label
            htmlFor="images-upload"
            className={`flex items-center justify-center w-full p-3 border border-white/20 rounded-lg cursor-pointer transition-colors ${
              isUploading ? 'bg-gray-600 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
          >
            <Upload className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-400">
              {isUploading ? 'جاري الرفع...' : 'إضافة صور'}
            </span>
          </label>
        </div>
      </div>

      {/* Videos Section */}
      <div>
        <label className="block text-gray-400 text-sm mb-3">
          فيديوهات المنتج ({videos.length})
        </label>
        
        {/* Existing Videos */}
        {videos.length > 0 && (
          <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
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
                <div className="mt-2">
                  {video.startsWith('data:video/') ? (
                    <video 
                      src={video} 
                      className="w-full h-32 object-cover rounded"
                      controls
                    />
                  ) : (
                    <img 
                      src={video} 
                      alt={`Video thumbnail ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
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
            disabled={isUploading}
          />
          <label
            htmlFor="videos-upload"
            className={`flex items-center justify-center w-full p-3 border border-white/20 rounded-lg cursor-pointer transition-colors ${
              isUploading ? 'bg-gray-600 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
          >
            <Upload className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-400">
              {isUploading ? 'جاري الرفع...' : 'إضافة فيديوهات'}
            </span>
          </label>
        </div>
      </div>

      {(images.length > 0 || videos.length > 0) && (
        <div className="text-xs text-gray-500 text-center">
          إجمالي الملفات: {images.length + videos.length}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
