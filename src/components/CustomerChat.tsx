
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomerChatService, { type ChatMessage } from '../utils/customerChatService';
import { useToast } from '@/hooks/use-toast';

interface CustomerChatProps {
  customerId: number;
  customerEmail: string;
}

const CustomerChat: React.FC<CustomerChatProps> = ({ customerId, customerEmail }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    // تحديث الرسائل كل 10 ثوان للحصول على ردود الإدارة
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [customerId]);

  useEffect(() => {
    // التمرير لأسفل عند إضافة رسائل جديدة
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = () => {
    const customerMessages = CustomerChatService.getCustomerMessages(customerId);
    setMessages(customerMessages);
    // تحديد الرسائل كمقروءة
    CustomerChatService.markMessagesAsRead(customerId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const success = CustomerChatService.sendCustomerMessage(customerId, customerEmail, newMessage.trim());
    
    if (success) {
      setNewMessage('');
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
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* منطقة الرسائل */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full pr-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">لا توجد رسائل حتى الآن</p>
                <p className="text-gray-500 text-sm">ابدأ المحادثة بكتابة رسالتك أدناه</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {/* رسالة العميل */}
                  <div className="flex justify-end">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-blue-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-white">{message.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* رد الإدارة */}
                  {message.adminReply && (
                    <div className="flex justify-start">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-start gap-2">
                          <UserCheck className="w-4 h-4 text-green-400 mt-1" />
                          <div className="flex-1">
                            <p className="text-green-400 text-sm font-medium mb-1">فريق الدعم</p>
                            <p className="text-white">{message.adminReply}</p>
                            <p className="text-gray-400 text-xs mt-1">{message.adminReplyTimestamp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* نموذج إرسال الرسالة */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !newMessage.trim()}
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
