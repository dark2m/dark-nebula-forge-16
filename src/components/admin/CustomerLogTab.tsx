import React, { useState, useEffect, useRef } from 'react';
import { Users, UserCheck, UserX, Eye, Shield, Clock, Ban, LogOut, AlertTriangle, Trash2, Lock, MessageCircle, Send, Reply, Paperclip, Image, Video, X, ExternalLink } from 'lucide-react';
import CustomerAuthService, { type LoginAttempt, type CustomerUser } from '../../utils/customerAuthService';
import CustomerChatService, { type ChatMessage, type ChatSession, type AdminMessage, type MediaAttachment } from '../../utils/customerChatService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const CustomerLogTab = () => {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<(ChatMessage | AdminMessage)[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showChatMessages, setShowChatMessages] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
    loadLoginAttempts();
    loadChatSessions();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  const loadCustomers = () => {
    const allCustomers = CustomerAuthService.getCustomers();
    const enrichedCustomers: CustomerUser[] = allCustomers.map(customer => ({
      ...customer,
      createdAt: customer.registrationDate,
      isVerified: true,
      isBlocked: localStorage.getItem(`blocked_${customer.id}`) === 'true',
      isOnline: localStorage.getItem(`online_${customer.id}`) === 'true',
      lastSeen: localStorage.getItem(`lastSeen_${customer.id}`) || 'غير معروف'
    }));
    setCustomers(enrichedCustomers);
  };

  const loadLoginAttempts = () => {
    setLoginAttempts(CustomerAuthService.getLoginAttempts());
  };

  const loadChatSessions = () => {
    setChatSessions(CustomerChatService.getChatSessions());
  };

  const handleBlockCustomer = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const isCurrentlyBlocked = localStorage.getItem(`blocked_${customerId}`) === 'true';
    const newBlockedStatus = !isCurrentlyBlocked;

    localStorage.setItem(`blocked_${customerId}`, newBlockedStatus.toString());
    loadCustomers();

    toast({
      title: newBlockedStatus ? "تم حظر العميل" : "تم إلغاء حظر العميل",
      description: newBlockedStatus
        ? `تم حظر ${customer.email} بنجاح.`
        : `تم إلغاء حظر ${customer.email} بنجاح.`,
    });
  };

  const handleLogoutCustomer = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    CustomerAuthService.logout();
    localStorage.removeItem(`online_${customerId}`);
    localStorage.setItem(`lastSeen_${customerId}`, new Date().toLocaleString('ar-SA'));
    loadCustomers();

    toast({
      title: "تم تسجيل خروج العميل",
      description: `تم تسجيل خروج ${customer.email} بنجاح.`,
    });
  };

  const handleDeleteCustomer = (customerId: number) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    if (!customerToDelete) return;

    if (CustomerAuthService.isDefaultCustomer(customerId)) {
      toast({
        title: "غير مسموح",
        description: "لا يمكن حذف هذا العميل",
        variant: "destructive"
      });
      return;
    }

    const confirmDelete = window.confirm(`هل أنت متأكد أنك تريد حذف ${customerToDelete.email}؟`);
    if (!confirmDelete) return;

    const allCustomers = CustomerAuthService.getCustomers();
    const updatedCustomers = allCustomers.filter(c => c.id !== customerId);
    CustomerAuthService.saveCustomers(updatedCustomers);
    loadCustomers();

    toast({
      title: "تم حذف العميل",
      description: `تم حذف ${customerToDelete.email} بنجاح.`,
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerClick = (customer: CustomerUser) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleSessionClick = async (session: ChatSession) => {
    setSelectedSession(session);
    setShowChatMessages(true);
    setIsLoadingMessages(true);

    try {
      const messages = CustomerChatService.getCustomerMessages(session.customerId);
      setCurrentMessages(messages);
      CustomerChatService.markMessagesAsRead(session.customerId);
      loadChatSessions();
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الرسائل",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedSession) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد محادثة لإرسال الرسالة",
        variant: "destructive"
      });
      return;
    }

    if (!newMessage.trim() && attachments.length === 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رسالة أو إرفاق ملف",
        variant: "destructive"
      });
      return;
    }

    try {
      const mediaAttachments: MediaAttachment[] = attachments.map(file => ({
        type: file.type.startsWith('image') ? 'image' as const : 'video' as const,
        data: URL.createObjectURL(file)
      }));

      const success = CustomerChatService.sendAdminMessage(selectedSession.customerId, newMessage, mediaAttachments);
      if (success) {
        setNewMessage('');
        setAttachments([]);
        const messages = CustomerChatService.getCustomerMessages(selectedSession.customerId);
        setCurrentMessages(messages);
        loadChatSessions();
        toast({
          title: "تم الإرسال",
          description: "تم إرسال الرسالة بنجاح"
        });
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إرسال الرسالة",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive"
      });
    }
  };

  const handleReply = async () => {
    if (!replyingTo || !replyMessage.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد رسالة والرد عليها",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSession) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد محادثة لإرسال الرد",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = CustomerChatService.sendAdminReply(selectedSession.customerId, replyingTo, replyMessage);
      if (success) {
        setReplyMessage('');
        setReplyingTo(null);
        const messages = CustomerChatService.getCustomerMessages(selectedSession.customerId);
        setCurrentMessages(messages);
        loadChatSessions();
        toast({
          title: "تم الإرسال",
          description: "تم إرسال الرد بنجاح"
        });
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إرسال الرد",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الرد",
        variant: "destructive"
      });
    }
  };

  const handleCloseSession = () => {
    if (!selectedSession) return;

    CustomerChatService.closeSession(selectedSession.customerId);
    loadChatSessions();
    setSelectedSession(null);
    setCurrentMessages([]);
    setShowChatMessages(false);

    toast({
      title: "تم إغلاق المحادثة",
      description: "تم إغلاق المحادثة بنجاح"
    });
  };

  const handleDeleteSession = () => {
    if (!selectedSession) return;

    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذه المحادثة؟");
    if (!confirmDelete) return;

    CustomerChatService.deleteCustomerSession(selectedSession.customerId);
    loadChatSessions();
    setSelectedSession(null);
    setCurrentMessages([]);
    setShowChatMessages(false);

    toast({
      title: "تم حذف المحادثة",
      description: "تم حذف المحادثة بنجاح"
    });
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments(files);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prevAttachments => prevAttachments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">سجل العملاء</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="customers">العملاء ({customers.length})</TabsTrigger>
          <TabsTrigger value="attempts">محاولات الدخول ({loginAttempts.length})</TabsTrigger>
          <TabsTrigger value="chat">المحادثات ({chatSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">قائمة العملاء</CardTitle>
              <Input
                type="search"
                placeholder="ابحث عن عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">تاريخ التسجيل</th>
                      <th className="text-right text-gray-300 p-2">آخر ظهور</th>
                      <th className="text-right text-gray-300 p-2">الحالة</th>
                      <th className="text-right text-gray-300 p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => handleCustomerClick(customer)}>
                        <td className="text-white p-2">{customer.email}</td>
                        <td className="text-gray-300 p-2">{customer.createdAt}</td>
                        <td className="text-gray-300 p-2">{customer.lastSeen}</td>
                        <td className="p-2">
                          {customer.isOnline ? (
                            <span className="text-green-400 flex items-center gap-1">
                              <UserCheck className="w-4 h-4" />
                              متصل
                            </span>
                          ) : (
                            <span className="text-gray-400 flex items-center gap-1">
                              <UserX className="w-4 h-4" />
                              غير متصل
                            </span>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBlockCustomer(customer.id);
                              }}
                              variant="outline"
                              size="icon"
                              className="hover:bg-red-500/10 text-red-400"
                            >
                              {customer.isBlocked ? (
                                <UserCheck className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLogoutCustomer(customer.id);
                              }}
                              variant="outline"
                              size="icon"
                              className="hover:bg-blue-500/10 text-blue-400"
                            >
                              <LogOut className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomer(customer.id);
                              }}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">لا يوجد عملاء</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {showCustomerDetails && selectedCustomer && (
            <Card className="admin-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">تفاصيل العميل</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCustomerDetails(false)}>
                  <X className="w-4 h-4 mr-2" />
                  إغلاق
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-gray-400 mb-2">البريد الإلكتروني</h4>
                    <p className="text-white">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-2">تاريخ التسجيل</h4>
                    <p className="text-white">{selectedCustomer.createdAt}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-2">آخر ظهور</h4>
                    <p className="text-white">{selectedCustomer.lastSeen}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-2">الحالة</h4>
                    <p className="text-white">
                      {selectedCustomer.isOnline ? 'متصل' : 'غير متصل'}
                    </p>
                  </div>
                </div>
                <div className="space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" onClick={() => handleBlockCustomer(selectedCustomer.id)}>
                    {selectedCustomer.isBlocked ? 'إلغاء الحظر' : 'حظر'}
                  </Button>
                  <Button variant="outline" onClick={() => handleLogoutCustomer(selectedCustomer.id)}>
                    تسجيل الخروج
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteCustomer(selectedCustomer.id)}>
                    حذف العميل
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">قائمة المحادثات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">آخر نشاط</th>
                      <th className="text-right text-gray-300 p-2">الحالة</th>
                      <th className="text-right text-gray-300 p-2">رسائل غير مقروءة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chatSessions.map((session) => (
                      <tr
                        key={session.customerId}
                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                        onClick={() => handleSessionClick(session)}
                      >
                        <td className="text-white p-2">{session.customerEmail}</td>
                        <td className="text-gray-300 p-2">{session.lastActivity}</td>
                        <td className="p-2">
                          {session.status === 'active' ? (
                            <Badge variant="default">نشط</Badge>
                          ) : session.status === 'waiting' ? (
                            <Badge variant="secondary">في الانتظار</Badge>
                          ) : (
                            <Badge variant="destructive">مغلق</Badge>
                          )}
                        </td>
                        <td className="text-center p-2">
                          {session.unreadCount > 0 && (
                            <Badge className="bg-blue-500">{session.unreadCount}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {chatSessions.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">لا توجد محادثات</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {showChatMessages && selectedSession && (
            <Card className="admin-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">
                  المحادثة مع {selectedSession.customerEmail}
                </CardTitle>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" size="sm" onClick={handleCloseSession}>
                    إغلاق المحادثة
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteSession}>
                    حذف المحادثة
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowChatMessages(false)}>
                    <X className="w-4 h-4 mr-2" />
                    إغلاق
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[600px] flex flex-col justify-between">
                <div className="overflow-y-auto h-full">
                  <ScrollArea className="h-[500px] rounded-md pr-2">
                    <div className="space-y-4">
                      {isLoadingMessages ? (
                        <div className="text-center text-gray-400">
                          جاري تحميل الرسائل...
                        </div>
                      ) : (
                        currentMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex flex-col ${message.sender === 'support' ? 'items-start' : 'items-end'
                              }`}
                          >
                            <div
                              className={`rounded-xl p-3 max-w-md break-words ${message.sender === 'support'
                                ? 'bg-blue-500/20 text-white'
                                : 'bg-gray-800 text-gray-300'
                                }`}
                            >
                              {message.message}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 flex space-x-2 rtl:space-x-reverse">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index}>
                                      {attachment.type === 'image' ? (
                                        <a href={attachment.data} target="_blank" rel="noopener noreferrer">
                                          <img
                                            src={attachment.data}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-32 h-32 object-cover rounded-md"
                                          />
                                        </a>
                                      ) : (
                                        <video src={attachment.data} className="w-32 h-32 rounded-md" controls />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {'files' in message && message.files && message.files.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
                                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                        <Paperclip className="w-4 h-4" />
                                        {file.name}
                                      </a>
                                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="text-xs text-gray-400 mt-1">
                                {message.timestamp}
                              </div>
                            </div>
                            {'isFromCustomer' in message && message.isFromCustomer && !('adminReply' in message && message.adminReply) && (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => setReplyingTo(message.id)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Reply className="w-4 h-4 mr-2" />
                                رد
                              </Button>
                            )}
                            {'adminReply' in message && message.adminReply && (
                              <div className="mt-2 rounded-xl p-3 max-w-md break-words bg-green-500/20 text-white">
                                {message.adminReply}
                                <div className="text-xs text-gray-400 mt-1">
                                  تم الرد في {'adminReplyTimestamp' in message ? message.adminReplyTimestamp : ''}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {replyingTo ? (
                  <div className="mt-4">
                    <Textarea
                      placeholder="اكتب ردك هنا..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:border-blue-400"
                    />
                    <div className="flex justify-end mt-2 space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" onClick={() => setReplyingTo(null)}>
                        إلغاء
                      </Button>
                      <Button onClick={handleReply}>إرسال الرد</Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Input
                        type="text"
                        placeholder="اكتب رسالتك هنا..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:border-blue-400"
                      />
                      <input
                        type="file"
                        id="attachment-input"
                        multiple
                        onChange={handleAttachmentChange}
                        className="hidden"
                      />
                      <label htmlFor="attachment-input">
                        <Button variant="secondary" size="icon">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </label>
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4 mr-2" />
                        إرسال
                      </Button>
                    </div>
                    {attachments.length > 0 && (
                      <div className="flex items-center mt-2 space-x-2 rtl:space-x-reverse">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center bg-gray-700 rounded-md px-2 py-1">
                            <span className="text-gray-300 text-sm">{file.name}</span>
                            <Button variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="attempts" className="space-y-4">
          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">محاولات تسجيل الدخول</CardTitle>
                <CardDescription className="text-gray-400">
                  جميع محاولات تسجيل الدخول الناجحة والفاشلة
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  CustomerAuthService.clearLoginAttempts();
                  loadLoginAttempts();
                  toast({
                    title: "تم المسح",
                    description: "تم مسح جميع سجلات محاولات الدخول"
                  });
                }}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                مسح السجلات
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">الوقت</th>
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">كلمة المرور</th>
                      <th className="text-right text-gray-300 p-2">النتيجة</th>
                      <th className="text-right text-gray-300 p-2">عنوان IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginAttempts.map((attempt) => (
                      <tr key={attempt.id} className="border-white/10">
                        <td className="text-gray-300 p-2">
                          {attempt.timestamp}
                        </td>
                        <td className="text-white p-2">
                          {attempt.email}
                        </td>
                        <td className="text-gray-300 p-2">
                          {attempt.password}
                        </td>
                        <td className="p-2">
                          {attempt.success ? (
                            <span className="text-green-400 flex items-center gap-1">
                              <UserCheck className="w-4 h-4" />
                              نجح
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1">
                              <UserX className="w-4 h-4" />
                              فشل
                            </span>
                          )}
                        </td>
                        <td className="text-gray-400 p-2">
                          {attempt.ipAddress || 'غير معروف'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loginAttempts.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">لا توجد محاولات دخول</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerLogTab;
