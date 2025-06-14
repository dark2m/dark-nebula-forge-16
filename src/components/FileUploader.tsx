
import React, { useRef, useState } from 'react';
import { Upload, X, File, Image } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface FileUploaderProps {
  onFileUploaded?: (url: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  folder?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxSize = 50,
  folder = 'general'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useFileUpload();
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`حجم الملف كبير جداً. الحد الأقصى ${maxSize} ميجابايت`);
      return;
    }

    const url = await uploadFile(file, folder);
    if (url && onFileUploaded) {
      onFileUploaded(url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50/10' 
            : 'border-gray-300 hover:border-blue-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-400">جاري الرفع...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-gray-300">
              اسحب الملفات هنا أو اضغط للاختيار
            </p>
            <p className="text-sm text-gray-500">
              الحد الأقصى: {maxSize} ميجابايت
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
