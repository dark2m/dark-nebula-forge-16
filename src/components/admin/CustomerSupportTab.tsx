
import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, UserCheck, Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import CustomerChatService, { type ChatMessage, type AdminMessage, type ChatSession } from '../../utils/customerChatService';
import { useToast } from '@/hooks/use-toast';

const CustomerSupportTab: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'video', data: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = () => {
    const chatSessions = CustomerChatService.getChatSessions();
    setSessions(chatSessions.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    ));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const newAttachments: { type: 'image' | 'video', data: string }[] = [];

    for (const file of Array.from(files)) {
      try {
        let processedFile: string;
        if (type === 'image') {
          processedFile = await compressImage(file, 0.7);
        } else {
          processedFile = await compressVideo(file, 0.6);
        }
        newAttachments.push({ type, data: processedFile });
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
    if (!selectedSession || (!newMessage.trim() && attachments.length === 0)) return;

    setIsLoading(true);
    const success = CustomerChatService.sendAdminMessage(
      selectedSession.customerId, 
      newMessage.trim(),
      attachments
    );
    
    if (success) {
      setNewMessage('');
      setAttachments([]);
      loadSessions();
      
      // Update selected session
      const updatedSessions = CustomerChatService.getChatSessions();
      const updatedSession = updatedSessions.find(s => s.customerId === selectedSession.customerId);
      if (updatedSession) {
        setSelectedSession(updatedSession);
      }
      
      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال رسالتك للعميل بنجاح"
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

  const closeSession = (customerId: number) => {
    CustomerChatService.closeSession(customerId);
    loadSessions();
    if (selectedSession?.customerId === customerId) {
      setSelectedSession(null);
    }
    toast({
      title: "تم إغلاق المحادثة",
      description: "تم إغلاق المحادثة مع العميل"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Sessions List */}
      <div className="lg:col-span-1">
        <Card className="admin-card h-full">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              محادثات العملاء
            </CardTitle>
            <CardDescription className="text-gray-400">
              إجمالي الرسائل غير المقروءة: {CustomerChatService.getTotalUnreadCount()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-2 p-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">لا توجد محادثات</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.customerId}
                      onClick={() => setSelectedSession(session)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedSession?.customerId === session.customerId
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">
                            {session.customerEmail}
                          </span>
                        </div>
                        {session.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge 
                          variant={session.status === 'waiting' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {session.status === 'waiting' ? 'في الانتظار' : 
                           session.status === 'active' ? 'نشط' : 'مغلق'}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {session.lastActivity}
                        </span>
                      </div>
                      {session.status !== 'closed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeSession(session.customerId);
                          }}
                          className="mt-2 text-xs"
                        >
                          إغلاق المحادثة
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2">
        {selectedSession ? (
          <Card className="admin-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                محادثة مع {selectedSession.customerEmail}
              </CardTitle>
              <CardDescription className="text-gray-400">
                آخر نشاط: {selectedSession.lastActivity}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
              <ScrollArea className="flex-1 w-full">
                <div className="space-y-4 p-2">
                  {selectedSession.messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      {'isFromAdmin' in message ? (
                        // Admin message
                        <div className="flex justify-end">
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 max-w-[80%]">
                            <div className="flex items-start gap-2">
                              <UserCheck className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-green-400 text-sm font-medium mb-1">أنت</p>
                                <p className="text-white break-words">{message.message}</p>
                                {renderAttachments(message.attachments)}
                                <p className="text-gray-400 text-xs mt-1">{message.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Customer message
                        <div className="flex justify-start">
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 max-w-[80%]">
                            <div className="flex items-start gap-2">
                              <User className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-blue-400 text-sm font-medium mb-1">{selectedSession.customerEmail}</p>
                                <p className="text-white break-words">{message.message}</p>
                                {renderAttachments(message.attachments)}
                                <p className="text-gray-400 text-xs mt-1">{message.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                    id="admin-image-upload"
                    disabled={isLoading}
                  />
                  <label htmlFor="admin-image-upload">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 hover:bg-white/20"
                      asChild
                    >
                      <span className="cursor-pointer">
                        <ImageIcon className="w-4 h-4" />
                      </span>
                    </Button>
                  </label>

                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                    id="admin-video-upload"
                    disabled={isLoading}
                  />
                  <label htmlFor="admin-video-upload">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 hover:bg-white/20"
                      asChild
                    >
                      <span className="cursor-pointer">
                        <Video className="w-4 h-4" />
                      </span>
                    </Button>
                  </label>
                </div>
                
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك للعميل..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1"
                  disabled={isLoading || selectedSession.status === 'closed'}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || (!newMessage.trim() && attachments.length === 0) || selectedSession.status === 'closed'}
                  className="glow-button"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="admin-card h-full flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">اختر محادثة للبدء</h3>
              <p className="text-gray-400">اختر محادثة من القائمة للرد على العميل</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportTab;
