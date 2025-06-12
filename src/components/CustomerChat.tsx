import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, UserCheck, Paperclip, X, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomerChatService, { type ChatMessage, type AdminMessage } from '../utils/customerChatService';
import { useToast } from '@/hooks/use-toast';

interface CustomerChatProps {
  customerId: number;
  customerEmail: string;
}

const CustomerChat: React.FC<CustomerChatProps> = ({ customerId, customerEmail }) => {
  const [messages, setMessages] = useState<(ChatMessage | AdminMessage)[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'video', data: string }[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [customerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = () => {
    const customerMessages = CustomerChatService.getCustomerMessages(customerId.toString());
    setMessages(customerMessages);
    CustomerChatService.markMessagesAsRead(customerId.toString());
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const newAttachments: { type: 'image' | 'video', data: string }[] = [];

    for (const file of Array.from(files)) {
      try {
        let processedFile: string;
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        
        if (isImage) {
          processedFile = await compressImage(file, 0.7);
          newAttachments.push({ type: 'image', data: processedFile });
        } else if (isVideo) {
          processedFile = await compressVideo(file, 0.6);
          newAttachments.push({ type: 'video', data: processedFile });
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    
    setIsLoading(false);
    event.target.value = '';
  };

  const compressImage = (file: File, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

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
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(thumbnailDataUrl);
          } else {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read video'));
            reader.readAsDataURL(file);
          }
        };
      };

      video.onerror = () => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read video'));
        reader.readAsDataURL(file);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    setIsLoading(true);
    
    // إذا لم يكن هناك نص ولكن توجد مرفقات، استخدم نص افتراضي
    let messageText = newMessage.trim();
    if (!messageText && attachments.length > 0) {
      const imageCount = attachments.filter(att => att.type === 'image').length;
      const videoCount = attachments.filter(att => att.type === 'video').length;
      
      if (imageCount > 0 && videoCount > 0) {
        messageText = `تم إرسال ${imageCount} صورة و ${videoCount} فيديو`;
      } else if (imageCount > 0) {
        messageText = imageCount === 1 ? 'تم إرسال صورة' : `تم إرسال ${imageCount} صور`;
      } else if (videoCount > 0) {
        messageText = videoCount === 1 ? 'تم إرسال فيديو' : `تم إرسال ${videoCount} فيديوهات`;
      }
    }
    
    const success = CustomerChatService.sendCustomerMessage(
      customerId.toString(), 
      customerEmail, 
      messageText, 
      attachments
    );
    
    if (success) {
      setNewMessage('');
      setAttachments([]);
      loadMessages();
      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال رسالتك بنجاح. سيتم الرد عليك قريباً"
      });
    } else {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const renderMessageText = (message: string, attachments?: { type: 'image' | 'video', data: string }[]) => {
    // إذا كانت الرسالة فارغة أو تحتوي على مسافات فقط ولكن توجد مرفقات
    if ((!message || message.trim() === '') && attachments && attachments.length > 0) {
      const imageCount = attachments.filter(att => att.type === 'image').length;
      const videoCount = attachments.filter(att => att.type === 'video').length;
      
      if (imageCount > 0 && videoCount > 0) {
        return `تم إرسال ${imageCount} صورة و ${videoCount} فيديو`;
      } else if (imageCount > 0) {
        return imageCount === 1 ? 'تم إرسال صورة' : `تم إرسال ${imageCount} صور`;
      } else if (videoCount > 0) {
        return videoCount === 1 ? 'تم إرسال فيديو' : `تم إرسال ${videoCount} فيديوهات`;
      }
    }
    
    return message || 'رسالة';
  };

  const renderAttachments = (attachments: { type: 'image' | 'video', data: string }[] | undefined) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="border border-white/20 rounded p-2 bg-white/5">
            {attachment.type === 'image' ? (
              <img 
                src={attachment.data} 
                alt={`Attachment ${index + 1}`}
                className="max-w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.open(attachment.data, '_blank')}
              />
            ) : (
              <div className="flex items-center gap-2 p-2">
                <Video className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">فيديو مرفق</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(attachment.data, '_blank')}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  عرض
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          شات خدمة العملاء
        </CardTitle>
        <CardDescription className="text-gray-300">
          أرسل رسالتك وسيتم الرد عليك من قبل فريق الدعم
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        <ScrollArea className="flex-1 w-full">
          <div className="space-y-4 p-2">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">لا توجد رسائل حتى الآن</p>
                <p className="text-gray-500 text-sm">ابدأ المحادثة بكتابة رسالتك أدناه</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {'isFromAdmin' in message ? (
                    <div className="flex justify-start">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-start gap-2">
                          <UserCheck className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-green-400 text-sm font-medium mb-1">فريق الدعم</p>
                            <p className="text-white break-words">{renderMessageText(message.message, message.attachments)}</p>
                            {renderAttachments(message.attachments)}
                            <p className="text-gray-400 text-xs mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white break-words">{renderMessageText(message.message, message.attachments)}</p>
                              {renderAttachments(message.attachments)}
                              <p className="text-gray-400 text-xs mt-1">{message.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {message.adminReply && (
                        <div className="flex justify-start">
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 max-w-[80%]">
                            <div className="flex items-start gap-2">
                              <UserCheck className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-green-400 text-sm font-medium mb-1">فريق الدعم</p>
                                <p className="text-white break-words">{message.adminReply}</p>
                                <p className="text-gray-400 text-xs mt-1">{message.adminReplyTimestamp}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {attachments.length > 0 && (
          <div className="border border-white/20 rounded-lg p-3 bg-white/5">
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="relative">
                  {attachment.type === 'image' ? (
                    <div className="relative">
                      <img 
                        src={attachment.data} 
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border border-white/20"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-1 -right-1 p-1 w-5 h-5"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative flex items-center gap-2 bg-white/10 rounded p-2">
                      <Video className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-300">فيديو</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="p-1 w-5 h-5"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex gap-1">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="media-upload"
              disabled={isLoading}
            />
            <label htmlFor="media-upload">
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="bg-white/10 border-white/20 hover:bg-white/20"
                asChild
              >
                <span className="cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                </span>
              </Button>
            </label>
          </div>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || (!newMessage.trim() && attachments.length === 0)}
            className="glow-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerChat;
