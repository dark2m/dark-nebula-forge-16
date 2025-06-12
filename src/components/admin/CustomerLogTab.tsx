import React, { useState, useEffect, useRef } from 'react';
import { Users, UserCheck, UserX, Eye, Shield, Clock, Ban, LogOut, AlertTriangle, Trash2, Lock, MessageCircle, Send, Reply, Paperclip, Image, Video, X, ExternalLink } from 'lucide-react';
import CustomerAuthService, { type LoginAttempt } from '../../utils/customerAuthService';
import CustomerChatService, { type ChatMessage, type ChatSession, type AdminMessage } from '../../utils/customerChatService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomerUser {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  isVerified: boolean;
  isDefault?: boolean;
  isBlocked?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
}

const CustomerLogTab = () => {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({});
  const [adminMessage, setAdminMessage] = useState<{[key: string]: string}>({});
  const [adminReplies, setAdminReplies] = useState<{[key: number]: string}>({});
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File[]}>({});
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
    loadLoginAttempts();
    loadChatSessions();
    
    // تحديث البيانات كل 30 ثانية
    const interval = setInterval(() => {
      updateOnlineStatus();
      loadChatSessions();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCustomers = () => {
    const allCustomers = CustomerAuthService.getCustomers();
    // إضافة معلومات إضافية للعملاء
    const enrichedCustomers = allCustomers.map(customer => ({
      ...customer,
      isBlocked: localStorage.getItem(`blocked_${customer.id}`) === 'true',
      isOnline: localStorage.getItem(`online_${customer.id}`) === 'true',
      lastSeen: localStorage.getItem(`lastSeen_${customer.id}`) || 'غير معروف'
    }));
    setCustomers(enrichedCustomers);
  };

  const loadLoginAttempts = () => {
    const attempts = CustomerAuthService.getLoginAttempts();
    setLoginAttempts(attempts.reverse()); // عرض الأحدث أولاً
  };

  const loadChatSessions = () => {
    const sessions = CustomerChatService.getChatSessions();
    setChatSessions(sessions.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    ));
  };

  const updateOnlineStatus = () => {
    // محاكاة تحديث حالة الاتصال
    const currentCustomer = CustomerAuthService.getCurrentCustomer();
    if (currentCustomer) {
      localStorage.setItem(`online_${currentCustomer.id}`, 'true');
      localStorage.setItem(`lastSeen_${currentCustomer.id}`, new Date().toLocaleString('ar-SA'));
    }
    loadCustomers();
  };

  const togglePasswordVisibility = (customerId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  const blockCustomer = (customerId: number) => {
    // منع حظر الحسابات الافتراضية
    if (CustomerAuthService.isDefaultCustomer(customerId)) {
      toast({
        title: "غير مسموح",
        description: "لا يمكن حظر الحسابات الافتراضية المحمية",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem(`blocked_${customerId}`, 'true');
    
    // تسجيل خروج العميل إذا كان متصلاً حالياً
    CustomerAuthService.checkAndLogoutDeletedCustomer(customerId);
    
    loadCustomers();
    toast({
      title: "تم حظر العميل",
      description: "تم حظر العميل وتسجيل خروجه تلقائياً - لن يتمكن من تسجيل الدخول مرة أخرى"
    });
  };

  const unblockCustomer = (customerId: number) => {
    localStorage.removeItem(`blocked_${customerId}`);
    loadCustomers();
    toast({
      title: "تم إلغاء حظر العميل",
      description: "تم إلغاء حظر العميل بنجاح - يمكنه الآن تسجيل الدخول"
    });
  };

  const forceLogout = (customerId: number) => {
    // منع تسجيل خروج الحسابات الافتراضية إجبارياً
    if (CustomerAuthService.isDefaultCustomer(customerId)) {
      toast({
        title: "غير مسموح",
        description: "لا يمكن تسجيل خروج الحسابات الافتراضية إجبارياً",
        variant: "destructive"
      });
      return;
    }

    // إزالة الرمز المميز للعميل
    const currentCustomer = CustomerAuthService.getCurrentCustomer();
    if (currentCustomer && currentCustomer.id === customerId) {
      CustomerAuthService.logout();
    }
    
    localStorage.setItem(`online_${customerId}`, 'false');
    localStorage.setItem(`lastSeen_${customerId}`, new Date().toLocaleString('ar-SA'));
    loadCustomers();
    
    toast({
      title: "تم تسجيل خروج العميل",
      description: "تم تسجيل خروج العميل بنجاح"
    });
  };

  const deleteCustomer = (customerId: number) => {
    // منع حذف الحسابات الافتراضية
    if (CustomerAuthService.isDefaultCustomer(customerId)) {
      toast({
        title: "غير مسموح",
        description: "لا يمكن حذف الحسابات الافتراضية المحمية",
        variant: "destructive"
      });
      return;
    }

    const allCustomers = CustomerAuthService.getCustomers();
    const updatedCustomers = allCustomers.filter(c => c.id !== customerId);
    CustomerAuthService.saveCustomers(updatedCustomers);
    
    // تسجيل خروج العميل تلقائياً إذا كان متصلاً حالياً
    CustomerAuthService.checkAndLogoutDeletedCustomer(customerId);
    
    // تنظيف البيانات الإضافية
    localStorage.removeItem(`blocked_${customerId}`);
    localStorage.removeItem(`online_${customerId}`);
    localStorage.removeItem(`lastSeen_${customerId}`);
    
    loadCustomers();
    toast({
      title: "تم حذف العميل",
      description: "تم حذف العميل نهائياً وتسجيل خروجه تلقائياً"
    });
  };

  const handleFileSelect = (customerId: string, event: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFiles(prev => ({
      ...prev,
      [customerId]: [...(prev[customerId] || []), ...validFiles]
    }));
  };

  const removeFile = (customerId: string, index: number) => {
    setSelectedFiles(prev => ({
      ...prev,
      [customerId]: (prev[customerId] || []).filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendAdminMessage = (customerId: string) => {
    const message = adminMessage[customerId];
    const files = selectedFiles[customerId] || [];
    
    if (!message?.trim() && files.length === 0) return;

    const fileAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    const success = CustomerChatService.sendAdminMessage(customerId, message?.trim() || '', undefined, fileAttachments);
    if (success) {
      setAdminMessage(prev => ({
        ...prev,
        [customerId]: ''
      }));
      setSelectedFiles(prev => ({
        ...prev,
        [customerId]: []
      }));
      loadChatSessions();
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
  };

  const handleAdminReply = (messageId: number, customerId: string) => {
    const reply = adminReplies[messageId];
    if (!reply?.trim()) return;

    const success = CustomerChatService.sendAdminReply(customerId, messageId, reply.trim());
    if (success) {
      setAdminReplies(prev => ({
        ...prev,
        [messageId]: ''
      }));
      loadChatSessions();
      toast({
        title: "تم إرسال الرد",
        description: "تم إرسال ردك للعميل بنجاح"
      });
    } else {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرد",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (customer: CustomerUser) => {
    if (customer.isDefault) {
      return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1">
        <Lock className="w-3 h-3" />
        محمي
      </span>;
    }
    if (customer.isBlocked) {
      return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">محظور</span>;
    }
    if (customer.isOnline) {
      return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">متصل</span>;
    }
    return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">غير متصل</span>;
  };

  const clearLoginAttempts = () => {
    CustomerAuthService.clearLoginAttempts();
    setLoginAttempts([]);
    toast({
      title: "تم مسح سجل المحاولات",
      description: "تم مسح جميع محاولات تسجيل الدخول"
    });
  };

  // دالة لعرض المرفقات من العملاء
  const renderCustomerAttachments = (attachments: { type: 'image' | 'video', data: string }[] | undefined) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        <p className="text-blue-400 text-sm font-medium">المرفقات:</p>
        {attachments.map((attachment, index) => (
          <div key={index} className="border border-blue-500/20 rounded-lg p-3 bg-blue-500/5">
            {attachment.type === 'image' ? (
              <div className="space-y-2">
                <img 
                  src={attachment.data} 
                  alt={`مرفق ${index + 1}`}
                  className="max-w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity max-h-60"
                  onClick={() => window.open(attachment.data, '_blank')}
                />
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 text-sm flex items-center gap-1">
                    <Image className="w-4 h-4" />
                    صورة من العميل
                  </span>
                  <button
                    onClick={() => window.open(attachment.data, '_blank')}
                    className="text-blue-400 hover:text-blue-300"
                    title="فتح في نافذة جديدة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <video 
                  src={attachment.data} 
                  controls 
                  className="max-w-full h-auto rounded max-h-60"
                  preload="metadata"
                />
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 text-sm flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    فيديو من العميل
                  </span>
                  <button
                    onClick={() => window.open(attachment.data, '_blank')}
                    className="text-blue-400 hover:text-blue-300"
                    title="فتح في نافذة جديدة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const onlineCustomers = customers.filter(c => c.isOnline && !c.isBlocked).length;
  const blockedCustomers = customers.filter(c => c.isBlocked).length;
  const failedAttempts = loginAttempts.filter(a => !a.success).length;
  const totalUnreadMessages = CustomerChatService.getTotalUnreadCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">سجل العملاء</h2>
        <Button 
          onClick={() => {
            loadCustomers();
            loadLoginAttempts();
            loadChatSessions();
          }}
          className="glow-button"
        >
          تحديث البيانات
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">إجمالي العملاء</p>
                <p className="text-white text-xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <UserCheck className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">متصل الآن</p>
                <p className="text-white text-xl font-bold">{onlineCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Ban className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-gray-400 text-sm">محظور</p>
                <p className="text-white text-xl font-bold">{blockedCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">نشط</p>
                <p className="text-white text-xl font-bold">{customers.length - blockedCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-gray-400 text-sm">محاولات فاشلة</p>
                <p className="text-white text-xl font-bold">{failedAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-gray-400 text-sm">رسائل جديدة</p>
                <p className="text-white text-xl font-bold">{totalUnreadMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التبويبات */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="customers" className="text-white data-[state=active]:bg-blue-500/20">
            العملاء المسجلون
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-white data-[state=active]:bg-blue-500/20 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            رسائل العملاء
            {totalUnreadMessages > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {totalUnreadMessages}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="attempts" className="text-white data-[state=active]:bg-blue-500/20">
            محاولات تسجيل الدخول
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          {/* جدول العملاء */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                قائمة العملاء
              </CardTitle>
              <CardDescription className="text-gray-400">
                إدارة جميع العملاء المسجلين في النظام (الحسابات المحمية لا يمكن حذفها أو حظرها)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">المعرف</TableHead>
                      <TableHead className="text-gray-300">البريد الإلكتروني</TableHead>
                      <TableHead className="text-gray-300">كلمة المرور</TableHead>
                      <TableHead className="text-gray-300">تاريخ التسجيل</TableHead>
                      <TableHead className="text-gray-300">الحالة</TableHead>
                      <TableHead className="text-gray-300">آخر ظهور</TableHead>
                      <TableHead className="text-gray-300">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id} className="border-white/10">
                        <TableCell className="text-white">#{customer.id}</TableCell>
                        <TableCell className="text-white">{customer.email}</TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            <span>
                              {showPasswords[customer.id] ? customer.password : '••••••••'}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => togglePasswordVisibility(customer.id)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(customer.createdAt).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(customer)}
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          {customer.lastSeen}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {customer.isDefault ? (
                              <span className="text-blue-400 text-xs px-2">حساب محمي</span>
                            ) : (
                              <>
                                {customer.isBlocked ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => unblockCustomer(customer.id)}
                                    className="text-green-400 hover:text-green-300 p-1"
                                    title="إلغاء الحظر (تمكين تسجيل الدخول)"
                                  >
                                    <UserCheck className="w-3 h-3" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => blockCustomer(customer.id)}
                                    className="text-red-400 hover:text-red-300 p-1"
                                    title="حظر العميل (منع تسجيل الدخول نهائياً)"
                                  >
                                    <Ban className="w-3 h-3" />
                                  </Button>
                                )}
                                
                                {customer.isOnline && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => forceLogout(customer.id)}
                                    className="text-orange-400 hover:text-orange-300 p-1"
                                    title="تسجيل خروج إجباري"
                                  >
                                    <LogOut className="w-3 h-3" />
                                  </Button>
                                )}
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteCustomer(customer.id)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                  title="حذف العميل نهائياً"
                                >
                                  <UserX className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {customers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">لا يوجد عملاء مسجلين حتى الآن</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          {/* جدول رسائل العملاء */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                رسائل العملاء
              </CardTitle>
              <CardDescription className="text-gray-400">
                جميع رسائل العملاء وردود الإدارة - يمكنك عرض الصور والفيديوهات التي يرسلها العملاء وإرسال ملفات للعميل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {chatSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">لا توجد رسائل من العملاء</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {chatSessions.map((session) => (
                      <div key={session.customerId} className="border border-white/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-white font-medium">{session.customerEmail}</h3>
                            <p className="text-gray-400 text-sm">آخر نشاط: {session.lastActivity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              session.status === 'waiting' ? 'bg-orange-500/20 text-orange-400' :
                              session.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {session.status === 'waiting' ? 'في انتظار الرد' :
                               session.status === 'active' ? 'نشط' : 'مغلق'}
                            </span>
                            {session.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {session.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {session.messages.map((message) => (
                            <div key={message.id} className="space-y-2">
                              {'isFromAdmin' in message ? (
                                // رسالة من الإدارة
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mr-4">
                                  <p className="text-green-400 text-sm font-medium mb-1">رسالة من الإدارة:</p>
                                  {message.message && <p className="text-white mb-2">{message.message}</p>}
                                  
                                  {/* عرض الملفات المرفقة من الإدارة */}
                                  {message.files && message.files.length > 0 && (
                                    <div className="space-y-2">
                                      {message.files.map((file, index) => (
                                        <div key={index} className="border border-green-500/20 rounded-lg p-2">
                                          {file.type.startsWith('image/') ? (
                                            <div className="space-y-2">
                                              <img 
                                                src={file.url} 
                                                alt={file.name}
                                                className="max-w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity max-h-60"
                                                onClick={() => window.open(file.url, '_blank')}
                                              />
                                              <div className="flex items-center justify-between text-xs">
                                                <span className="text-green-300">{file.name}</span>
                                                <button
                                                  onClick={() => window.open(file.url, '_blank')}
                                                  className="text-green-400 hover:text-green-300"
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
                                                className="max-w-full h-auto rounded max-h-60"
                                                preload="metadata"
                                              />
                                              <div className="flex items-center justify-between text-xs">
                                                <span className="text-green-300">{file.name}</span>
                                                <button
                                                  onClick={() => window.open(file.url, '_blank')}
                                                  className="text-green-400 hover:text-green-300"
                                                >
                                                  <ExternalLink className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                              <Paperclip className="w-4 h-4 text-green-400" />
                                              <span className="text-sm text-green-300">{file.name}</span>
                                              <span className="text-xs text-green-400">({formatFileSize(file.size)})</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <p className="text-gray-400 text-xs mt-1">{message.timestamp}</p>
                                </div>
                              ) : (
                                // رسالة العميل
                                <>
                                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                    <p className="text-white">{message.message}</p>
                                    
                                    {/* عرض المرفقات من العميل */}
                                    {renderCustomerAttachments(message.attachments)}
                                    
                                    <p className="text-gray-400 text-xs mt-1">{message.timestamp}</p>
                                  </div>
                                  
                                  {/* رد الإدارة إن وجد */}
                                  {message.adminReply && (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mr-4">
                                      <p className="text-green-400 text-sm font-medium mb-1">رد الإدارة:</p>
                                      <p className="text-white">{message.adminReply}</p>
                                      <p className="text-gray-400 text-xs mt-1">{message.adminReplyTimestamp}</p>
                                    </div>
                                  )}
                                  
                                  {/* نموذج الرد على الرسالة */}
                                  {!message.adminReply && (
                                    <div className="mr-4 flex gap-2">
                                      <Textarea
                                        placeholder="اكتب ردك على هذه الرسالة..."
                                        value={adminReplies[message.id] || ''}
                                        onChange={(e) => setAdminReplies(prev => ({
                                          ...prev,
                                          [message.id]: e.target.value
                                        }))}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1 min-h-[60px]"
                                      />
                                      <Button
                                        onClick={() => handleAdminReply(message.id, session.customerId)}
                                        disabled={!adminReplies[message.id]?.trim()}
                                        className="glow-button"
                                        title="رد على الرسالة"
                                      >
                                        <Reply className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* منطقة الملفات المحددة */}
                        {selectedFiles[session.customerId] && selectedFiles[session.customerId].length > 0 && (
                          <div className="mb-4 p-3 bg-white/10 rounded-lg border-t border-white/20">
                            <h4 className="text-sm font-medium text-white mb-2">الملفات المحددة:</h4>
                            <div className="space-y-2">
                              {selectedFiles[session.customerId].map((file, index) => (
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
                                    onClick={() => removeFile(session.customerId, index)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* نموذج إرسال رسالة جديدة للعميل */}
                        <div className="border-t border-white/20 pt-4">
                          <div className="space-y-3">
                            <Textarea
                              placeholder="إرسال رسالة جديدة للعميل..."
                              value={adminMessage[session.customerId] || ''}
                              onChange={(e) => setAdminMessage(prev => ({
                                ...prev,
                                [session.customerId]: e.target.value
                              }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <input
                                ref={(el) => fileInputRefs.current[session.customerId] = el}
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={(e) => handleFileSelect(session.customerId, e)}
                                className="hidden"
                              />
                              <Button
                                onClick={() => fileInputRefs.current[session.customerId]?.click()}
                                variant="outline"
                                className="flex items-center gap-2"
                                title="إرفاق صور أو فيديوهات"
                              >
                                <Paperclip className="w-4 h-4" />
                                إرفاق ملف
                              </Button>
                              <Button
                                onClick={() => handleSendAdminMessage(session.customerId)}
                                disabled={!adminMessage[session.customerId]?.trim() && (!selectedFiles[session.customerId] || selectedFiles[session.customerId].length === 0)}
                                className="glow-button flex items-center gap-2"
                                title="إرسال رسالة جديدة"
                              >
                                <Send className="w-4 h-4" />
                                إرسال
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts">
          {/* جدول محاولات تسجيل الدخول */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                محاولات تسجيل الدخول
              </CardTitle>
              <CardDescription className="text-gray-400 flex items-center justify-between">
                <span>جميع محاولات تسجيل الدخول الناجحة والفاشلة</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearLoginAttempts}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  مسح السجل
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">الوقت</TableHead>
                      <TableHead className="text-gray-300">البريد الإلكتروني</TableHead>
                      <TableHead className="text-gray-300">كلمة المرور المستخدمة</TableHead>
                      <TableHead className="text-gray-300">النتيجة</TableHead>
                      <TableHead className="text-gray-300">عنوان IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginAttempts.map((attempt) => (
                      <TableRow key={attempt.id} className="border-white/10">
                        <TableCell className="text-gray-300 text-sm">
                          {attempt.timestamp}
                        </TableCell>
                        <TableCell className="text-white">
                          {attempt.email}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {attempt.password}
                        </TableCell>
                        <TableCell>
                          {attempt.success ? (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                              نجح
                            </span>
                          ) : (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                              فشل
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {attempt.ipAddress || 'غير معروف'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {loginAttempts.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">لا توجد محاولات تسجيل دخول</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerLogTab;
