
import React, { useState } from 'react';
import { useSupabaseFeatures } from '@/hooks/useSupabaseFeatures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Video, FileText, Download, Search, Grid, List } from 'lucide-react';
import FileUploader from './FileUploader';

interface UserFileGalleryProps {
  folder?: string;
  allowUpload?: boolean;
}

const UserFileGallery: React.FC<UserFileGalleryProps> = ({
  folder = 'gallery',
  allowUpload = true
}) => {
  const {
    files,
    isLoading,
    handleFileUpload,
    isAuthenticated
  } = useSupabaseFeatures(folder);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos' | 'documents'>('all');

  const getFileType = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return 'video';
    return 'document';
  };

  const getFileIcon = (fileName: string) => {
    const type = getFileType(fileName);
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-green-400" />;
      case 'video': return <Video className="w-5 h-5 text-blue-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
      (filterType === 'images' && getFileType(file.name) === 'image') ||
      (filterType === 'videos' && getFileType(file.name) === 'video') ||
      (filterType === 'documents' && getFileType(file.name) === 'document');
    
    return matchesSearch && matchesType;
  });

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">يجب تسجيل الدخول لعرض الملفات</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Image className="w-6 h-6" />
              معرض الملفات
              <span className="text-sm text-gray-400">({filteredFiles.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في الملفات..."
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              <option value="all">جميع الملفات</option>
              <option value="images">الصور</option>
              <option value="videos">الفيديوهات</option>
              <option value="documents">المستندات</option>
            </select>
          </div>

          {/* Upload Area */}
          {allowUpload && (
            <FileUploader
              onFileUploaded={(url) => console.log('File uploaded to gallery:', url)}
              folder={folder}
              acceptedTypes={['image/*', 'video/*', 'application/pdf', '.txt', '.doc', '.docx']}
              maxSize={50}
            />
          )}
        </CardContent>
      </Card>

      {/* Files Display */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">جاري تحميل الملفات...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">لا توجد ملفات لعرضها</p>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-2">
                  جرب البحث بكلمات مختلفة
                </p>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-3'
            }>
              {filteredFiles.map((file, index) => (
                <div key={index} className={viewMode === 'grid' 
                  ? 'bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors'
                  : 'flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors'
                }>
                  <div className={viewMode === 'grid' ? 'text-center space-y-2' : 'flex items-center gap-3'}>
                    <div className={viewMode === 'grid' ? 'mx-auto' : ''}>
                      {getFileIcon(file.name)}
                    </div>
                    <div className={viewMode === 'grid' ? '' : 'flex-1'}>
                      <p className="text-white text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(file.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFileGallery;
