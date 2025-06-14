import React, { useState } from 'react';
import { Plus, X, Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MediaManagerProps {
  productId: number;
  images: string[];
  videos: string[];
  onImagesChange: (productId: number, images: string[]) => void;
  onVideosChange: (productId: number, videos: string[]) => void;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  productId,
  images,
  videos,
  onImagesChange,
  onVideosChange
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('Adding images to product:', productId);
    
    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      try {
        // التحقق من حجم الملف (أقل من 2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: "ملف كبير جداً",
            description: `الملف ${file.name} كبير جداً. يرجى اختيار ملف أصغر من 2MB`,
            variant: "destructive"
          });
          continue;
        }

        const compressedImage = await compressImage(file, 0.7);
        newImages.push(compressedImage);
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: "خطأ في معالجة الصورة",
          description: `فشل في معالجة ${file.name}`,
          variant: "destructive"
        });
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      console.log('Calling onImagesChange for product:', productId, 'with images:', updatedImages.length);
      onImagesChange(productId, updatedImages);
      
      toast({
        title: "تم إضافة الصور",
        description: `تم إضافة ${newImages.length} صورة بنجاح`
      });
    }
    
    setIsUploading(false);
    event.target.value = '';
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('Adding videos to product:', productId);
    
    setIsUploading(true);
    const newVideos: string[] = [];

    for (const file of Array.from(files)) {
      try {
        // التحقق من حجم الملف (أقل من 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "ملف كبير جداً",
            description: `الفيديو ${file.name} كبير جداً. يرجى اختيار ملف أصغر من 10MB`,
            variant: "destructive"
          });
          continue;
        }

        const videoThumbnail = await createVideoThumbnail(file);
        newVideos.push(videoThumbnail);
      } catch (error) {
        console.error('Error processing video:', error);
        toast({
          title: "خطأ في معالجة الفيديو",
          description: `فشل في معالجة ${file.name}`,
          variant: "destructive"
        });
      }
    }

    if (newVideos.length > 0) {
      const updatedVideos = [...videos, ...newVideos];
      console.log('Calling onVideosChange for product:', productId, 'with videos:', updatedVideos.length);
      onVideosChange(productId, updatedVideos);
      
      toast({
        title: "تم إضافة الفيديوهات",
        description: `تم إضافة ${newVideos.length} فيديو بنجاح`
      });
    }
    
    setIsUploading(false);
    event.target.value = '';
  };

  // دالة ضغط الصور محسنة
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

  // دالة إنشاء صورة مصغرة للفيديو
  const createVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = Math.min(video.videoWidth, 480);
        canvas.height = Math.min(video.videoHeight, 360);
        
        video.currentTime = 1; // الثانية الأولى
        video.onseeked = () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // إنشاء صورة مصغرة من الفيديو
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(thumbnailDataUrl);
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
      };

      video.onerror = () => {
        reject(new Error('Failed to process video'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    console.log('Removing image from product:', productId);
    onImagesChange(productId, updatedImages);
    
    toast({
      title: "تم حذف الصورة",
      description: "تم حذف الصورة بنجاح"
    });
  };

  const removeVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    console.log('Removing video from product:', productId);
    onVideosChange(productId, updatedVideos);
    
    toast({
      title: "تم حذف الفيديو",
      description: "تم حذف الفيديو بنجاح"
    });
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
            id={`images-upload-${productId}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`images-upload-${productId}`}
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
                  <img 
                    src={video} 
                    alt={`Video thumbnail ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
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
            id={`videos-upload-${productId}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`videos-upload-${productId}`}
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
