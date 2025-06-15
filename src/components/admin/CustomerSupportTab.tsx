
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Search, MessageCircle, User, Calendar, Clock, Send, Trash2, Reply, Archive } from 'lucide-react';
import CustomerChatService from '../../utils/customerChatService';
import CustomerAuthService from '../../utils/customerAuthService';
import type { CustomerUser, ChatMessage } from '../../types/customer';

const CustomerSupportTab = () => {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadChatMessages();
  }, []);

  const loadCustomers = () => {
    try {
      const allCustomers = CustomerAuthService.getAllCustomers();
      console.log('Loaded customers:', allCustomers);
      setCustomers(allCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadChatMessages = () => {
    try {
      const messages = CustomerChatService.getAllMessages();
      setChatMessages(messages);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCustomer) return;

    try {
      const message: ChatMessage = {
        id: Date.now().toString(),
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.username,
        message: newMessage,
        timestamp: new Date().toISOString(),
        isFromAdmin: true,
        status: 'sent'
      };

      CustomerChatService.addMessage(message);
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = (messageId: string) => {
    try {
      CustomerChatService.deleteMessage(messageId);
      setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const archiveMessage = (messageId: string) => {
    try {
      CustomerChatService.archiveMessage(messageId);
      loadChatMessages();
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };

  const deleteCustomer = (customerId: string) => {
    try {
      CustomerAuthService.deleteCustomer(customerId);
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customerMessages = chatMessages.filter(msg => 
    selectedCustomer ? msg.customerId === selectedCustomer.id : false
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA');
  };

  const getCustomerPassword = (customer: CustomerUser): string => {
    // محاولة الحصول على كلمة السر من مصادر مختلفة
    if (customer.password) {
      return customer.password;
    }
    
    // البحث في localStorage عن كلمة السر
    try {
      const storedCustomers = localStorage.getItem('customer_users');
      if (storedCustomers) {
        const parsedCustomers = JSON.parse(storedCustomers);
        const foundCustomer = parsedCustomers.find((c: any) => c.id === customer.id || c.username === customer.username);
        if (foundCustomer && foundCustomer.password) {
          return foundCustomer.password;
        }
      }
    } catch (error) {
      console.error('Error getting password from storage:', error);
    }
    
    return 'غير متوفرة';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">خدمة العملاء</h2>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            onClick={() => setShowPasswords(!showPasswords)}
            variant="outline"
            size="sm"
            className="text-white border-white/20"
          >
            {showPasswords ? <EyeOff className="w-4 h-4 ml-2" /> : <Eye className="w-4 h-4 ml-2" />}
            {showPasswords ? 'إخفاء كلمات السر' : 'عرض كلمات السر'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <User className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-white/60 text-sm">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-white">{customers.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <MessageCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-white/60 text-sm">الرسائل</p>
              <p className="text-2xl font-bold text-white">{chatMessages.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Clock className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-white/60 text-sm">الرسائل النشطة</p>
              <p className="text-2xl font-bold text-white">{chatMessages.filter(msg => msg.status !== 'archived').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customers List */}
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">قائمة العملاء</h3>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="البحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-10"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id
                      ? 'bg-blue-500/20 border-blue-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{customer.username}</h4>
                      <p className="text-sm text-white/60">{customer.email}</p>
                      {showPasswords && (
                        <p className="text-sm text-green-400 mt-1">
                          كلمة السر: {getCustomerPassword(customer)}
                        </p>
                      )}
                      <p className="text-xs text-white/40 mt-1">
                        انضم في: {formatDate(customer.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Badge variant={customer.isActive ? "default" : "secondary"}>
                        {customer.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomer(customer.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">لا توجد عملاء</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Chat Interface */}
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {selectedCustomer ? `محادثة مع ${selectedCustomer.username}` : 'اختر عميل للمحادثة'}
              </h3>
              {selectedCustomer && (
                <Badge variant="outline" className="text-white border-white/20">
                  {customerMessages.length} رسالة
                </Badge>
              )}
            </div>

            {selectedCustomer ? (
              <>
                {/* Messages */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {customerMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.isFromAdmin
                          ? 'bg-blue-500/20 border-blue-400/50 border ml-8'
                          : 'bg-white/10 border-white/20 border mr-8'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white text-sm">{message.message}</p>
                          <p className="text-xs text-white/40 mt-1">
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse ml-2">
                          <Button
                            onClick={() => archiveMessage(message.id)}
                            variant="ghost"
                            size="sm"
                            className="text-white/60 hover:text-white p-1 h-auto"
                          >
                            <Archive className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => deleteMessage(message.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 p-1 h-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {customerMessages.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/60">لا توجد رسائل بعد</p>
                    </div>
                  )}
                </div>

                {/* Send Message */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="اكتب رسالتك هنا..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Send className="w-4 h-4 ml-2" />
                      إرسال
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">اختر عميل من القائمة لبدء المحادثة</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSupportTab;
