
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image, Video, X, Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomerChatService from '../../utils/customerChatService';
import type { ChatMessage } from '../../utils/customerChatService';
import { SiteSettings } from '../../types/admin';

interface CustomerSupportTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const CustomerSupportTab: React.FC<CustomerSupportTabProps> = ({ 
  siteSettings, 
  setSiteSettings, 
  saveSiteSettings 
}) => {
  const [activeCustomers, setActiveCustomers] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const customers = CustomerChatService.getActiveCustomers();
    setActiveCustomers(customers);
    
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCustomer) {
      const customerMessages = CustomerChatService.getMessages(selectedCustomer);
      setMessages(customerMessages);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!selectedCustomer) return;

    const messageData: Omit<ChatMessage, 'id' | 'timestamp'> = {
      customerId: selectedCustomer,
      message: newMessage.trim(),
      sender: 'support',
      files: selectedFiles.length > 0 ? selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      })) : undefined
    };

    CustomerChatService.addMessage(messageData);
    setMessages(CustomerChatService.getMessages(selectedCustomer));
    setNewMessage('');
    setSelectedFiles([]);

    toast({
      title: "تم إرسال الرسالة",
      description: "تم إرسال رسالتك إلى العميل بنجاح"
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      
      if (!isValidSize) {
        toast({
          title: "حجم الملف كبير جداً",
          description: "يجب أن يكون حجم الملف أقل من 50 ميجابايت",
          variant: "destructive"
        });
        return false;
      }
      
      return isImage || isVideo;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMessage = (message: ChatMessage) => {
    const isSupport = message.sender === 'support';
    
    return (
      <div key={message.id} className={`flex ${isSupport ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isSupport 
            ? 'bg-blue-600 text-white ml-2' 
            : 'bg-white/10 text-white mr-2'
        }`}>
          {message.message && (
            <p className="mb-2">{message.message}</p>
          )}
          
          {message.files && message.files.length > 0 && (
            <div className="space-y-2">
              {message.files.map((file, index) => (
                <div key={index} className="border border-white/20 rounded-lg p-2">
                  {file.type.startsWith('image/') ? (
                    <div className="space-y-2">
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="max-w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(file.url, '_blank')}
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span>{file.name}</span>
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="text-blue-300 hover:text-blue-200"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : file.type.startsWith('video/') ? (
                    <div className="space-y-2">
                      <video 
                        src={file.url} 
                        controls 
                        className="max-w-full h-auto rounded"
                        preload="metadata"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span>{file.name}</span>
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="text-blue-300 hover:text-blue-200"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs opacity-70">({formatFileSize(file.size)})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs opacity-70 mt-2">
            {new Date(message.timestamp).toLocaleTimeString('ar-SA')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">خدمة العملاء</h2>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* قائمة العملاء */}
        <div className="admin-card rounded-xl p-4">
          <h3 className="text-xl font-bold text-white mb-4">العملاء النشطون</h3>
          <div className="space-y-2">
            {activeCustomers.length === 0 ? (
              <p className="text-gray-400">لا يوجد عملاء نشطون</p>
            ) : (
              activeCustomers.map(customerId => (
                <button
                  key={customerId}
                  onClick={() => setSelectedCustomer(customerId)}
                  className={`w-full text-right p-3 rounded-lg transition-colors ${
                    selectedCustomer === customerId
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  العميل #{customerId}
                </button>
              ))
            )}
          </div>
        </div>

        {/* نافذة المحادثة */}
        <div className="lg:col-span-2 admin-card rounded-xl p-4">
          {selectedCustomer ? (
            <>
              <h3 className="text-xl font-bold text-white mb-4">
                محادثة مع العميل #{selectedCustomer}
              </h3>
              
              {/* منطقة الرسائل */}
              <div className="h-96 overflow-y-auto bg-black/20 rounded-lg p-4 mb-4">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-center">لا توجد رسائل</p>
                ) : (
                  messages.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* منطقة الملفات المحددة */}
              {selectedFiles.length > 0 && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-2">الملفات المحددة:</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/20 rounded p-2">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {file.type.startsWith('image/') ? (
                            <Image className="w-4 h-4 text-green-400" />
                          ) : (
                            <Video className="w-4 h-4 text-blue-400" />
                          )}
                          <span className="text-sm text-white">{file.name}</span>
                          <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* منطقة إرسال الرسائل */}
              <div className="flex space-x-2 rtl:space-x-reverse">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="إرفاق ملف"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-20">
              اختر عميلاً لبدء المحادثة
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportTab;
