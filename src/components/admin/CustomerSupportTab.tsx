import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../../types/admin';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Send,
  Eye,
  UserCheck,
  MessageSquare,
  Settings,
  RefreshCw,
  BarChart3,
  Star,
  Archive,
  Ban,
  Trash2,
  X,
  Reply,
  Paperclip,
  Lock,
  Search,
  Image as ImageIcon,
  Video,
  Upload,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerChatService, { type ChatSession, type ChatMessage, type AdminMessage } from '../../utils/customerChatService';
import CustomerAuthService, { type CustomerUser, type LoginAttempt } from '../../utils/customerAuthService';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';

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
  const [activeView, setActiveView] = useState<'overview' | 'messages' | 'customers' | 'analytics' | 'settings'>('overview');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'waiting' | 'closed'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<(ChatMessage | AdminMessage)[]>([]);
  const [adminAttachments, setAdminAttachments] = useState<{ type: 'image' | 'video', data: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadData = () => {
    loadChatSessions();
    loadCustomers();
    loadLoginAttempts();
  };

  const loadChatSessions = () => {
    const sessions = CustomerChatService.getChatSessions();
    setChatSessions(sessions);
  };

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
      setAdminAttachments(prev => [...prev, ...newAttachments]);
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

  const removeAdminAttachment = (index: number) => {
    setAdminAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = session.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = async () => {
    if (!selectedSession || (!newMessage.trim() && adminAttachments.length === 0)) return;

    setIsLoading(true);
    const success = CustomerChatService.sendAdminMessage(selectedSession, newMessage, adminAttachments);
    
    if (success) {
      setNewMessage('');
      setAdminAttachments([]);
      loadChatSessions();
      const messages = CustomerChatService.getCustomerMessages(selectedSession);
      setCurrentMessages(messages);
      toast({
        title: "تم إرسال الرد",
        description: "تم إرسال ردك بنجاح"
      });
    } else {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرد",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleCloseSession = (customerId: string) => {
    CustomerChatService.closeSession(customerId);
    loadChatSessions();
    toast({
      title: "تم إغلاق المحادثة",
      description: "تم إغلاق المحادثة بنجاح"
    });
  };

  const handleDeleteCustomerChat = (customerId: string) => {
    const session = chatSessions.find(s => s.customerId === customerId);
    if (!session) return;

    const confirmDelete = window.confirm(`هل أنت متأكد أنك تريد حذف محادثة ${session.customerEmail}؟ هذا الإجراء لا يمكن التراجع عنه.`);
    if (!confirmDelete) return;

    const success = CustomerChatService.deleteCustomerSession(customerId);
    if (success) {
      loadChatSessions();
      if (selectedSession === customerId) {
        setSelectedSession(null);
        setCurrentMessages([]);
      }
      toast({
        title: "تم حذف المحادثة",
        description: "تم حذف محادثة العميل بنجاح"
      });
    } else {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المحادثة",
        variant: "destructive"
      });
    }
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

  const handleDeleteCustomer = (customerId: number) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    if (!customerToDelete) return;

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

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session.customerId);
    const messages = CustomerChatService.getCustomerMessages(session.customerId);
    setCurrentMessages(messages);
    CustomerChatService.markMessagesAsRead(session.customerId);
    loadChatSessions();
  };

  const getTotalUnreadCount = () => {
    return chatSessions.reduce((total, session) => total + session.unreadCount, 0);
  };

  const getSessionsByStatus = (status: string) => {
    return chatSessions.filter(session => session.status === status).length;
  };

  const getResponseTimeAverage = () => {
    return "2.5 دقيقة";
  };

  const renderMessageAttachments = (message: ChatMessage | AdminMessage) => {
    const attachments = message.attachments || [];
    if (attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="border border-white/20 rounded p-2 bg-white/5">
            {attachment.type === 'image' ? (
              <img 
                src={attachment.data} 
                alt={`مرفق ${index + 1}`}
                className="max-w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.open(attachment.data, '_blank')}
              />
            ) : (
              <div className="space-y-2">
                <video 
                  src={attachment.data} 
                  controls 
                  className="max-w-full h-32 rounded"
                  preload="metadata"
                />
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">فيديو</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">المحادثات النشطة</p>
                <p className="text-3xl font-bold text-white">{getSessionsByStatus('active')}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">في الانتظار</p>
                <p className="text-3xl font-bold text-white">{getSessionsByStatus('waiting')}</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">إجمالي العملاء</p>
                <p className="text-3xl font-bold text-white">{customers.length}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">رسائل غير مقروءة</p>
                <p className="text-3xl font-bold text-white">{getTotalUnreadCount()}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات سريعة */}
      <Card className="bg-white/5 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            أدوات إدارة شاملة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button 
              onClick={() => setActiveView('messages')}
              className="bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-white h-20 flex flex-col gap-2"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">إدارة الرسائل</span>
            </Button>
            
            <Button 
              onClick={() => setActiveView('customers')}
              className="bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-white h-20 flex flex-col gap-2"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">إدارة العملاء</span>
            </Button>
            
            <Button 
              onClick={() => setActiveView('analytics')}
              className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-white h-20 flex flex-col gap-2"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">التقارير</span>
            </Button>
            
            <Button 
              onClick={loadData}
              className="bg-cyan-500/20 border-cyan-500/30 hover:bg-cyan-500/30 text-white h-20 flex flex-col gap-2"
            >
              <RefreshCw className="w-6 h-6" />
              <span className="text-sm">تحديث البيانات</span>
            </Button>
            
            <Button 
              onClick={() => setActiveView('settings')}
              className="bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30 text-white h-20 flex flex-col gap-2"
            >
              <Settings className="w-6 h-6" />
              <span className="text-sm">إعدادات الدعم</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* آخر المحادثات والعملاء */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-400" />
              آخر المحادثات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {chatSessions.slice(0, 5).map((session) => (
                  <div key={session.customerId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{session.customerEmail}</p>
                        <p className="text-gray-400 text-sm">{session.lastActivity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.status === 'waiting' ? 'destructive' : session.status === 'active' ? 'default' : 'secondary'}>
                        {session.status === 'waiting' ? 'في الانتظار' : session.status === 'active' ? 'نشط' : 'مغلق'}
                      </Badge>
                      {session.unreadCount > 0 && (
                        <Badge variant="destructive">{session.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              العملاء المتصلين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {customers.filter(c => c.isOnline).slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <UserCheck className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{customer.email}</p>
                        <p className="text-gray-400 text-sm">متصل الآن</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">متصل</Badge>
                  </div>
                ))}
                {customers.filter(c => c.isOnline).length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-400">لا يوجد عملاء متصلين حالياً</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* قائمة المحادثات */}
      <Card className="bg-white/5 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-white">المحادثات</CardTitle>
            <Button size="sm" onClick={loadChatSessions} className="bg-blue-500/20 hover:bg-blue-500/30">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في المحادثات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المحادثات</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="waiting">في الانتظار</SelectItem>
                <SelectItem value="closed">مغلقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-2 p-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.customerId}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    selectedSession === session.customerId
                      ? 'bg-blue-500/30 border-blue-500/50'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  } border`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p 
                      className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={() => handleSelectSession(session)}
                    >
                      {session.customerEmail}
                    </p>
                    <div className="flex gap-1">
                      {session.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">{session.unreadCount}</Badge>
                      )}
                      <Button
                        onClick={() => handleDeleteCustomerChat(session.customerId)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">{session.lastActivity}</p>
                    <Badge variant={session.status === 'waiting' ? 'destructive' : session.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {session.status === 'waiting' ? 'انتظار' : session.status === 'active' ? 'نشط' : 'مغلق'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* نافذة المحادثة */}
      <div className="lg:col-span-2">
        <Card className="bg-white/5 backdrop-blur-md border-white/20 h-full flex flex-col">
          {selectedSession ? (
            <>
              <CardHeader className="border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-white">
                      {filteredSessions.find(s => s.customerId === selectedSession)?.customerEmail}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      ID: {selectedSession}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => CustomerChatService.markMessagesAsRead(selectedSession)}
                      className="bg-green-500/20 hover:bg-green-500/30"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleCloseSession(selectedSession)}
                      className="bg-red-500/20 hover:bg-red-500/30"
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                <ScrollArea className="flex-1 mb-4 max-h-96">
                  <div className="space-y-3 pr-4">
                    {currentMessages.map((message) => (
                      <div key={message.id} className={`flex ${('isFromAdmin' in message || message.sender === 'support') ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          ('isFromAdmin' in message || message.sender === 'support')
                            ? 'bg-green-500/20 border-green-500/30' 
                            : 'bg-blue-500/20 border-blue-500/30'
                        } border`}>
                          <div className="flex items-center gap-2 mb-1">
                            {('isFromAdmin' in message || message.sender === 'support') ? (
                              <UserCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <Users className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="text-xs text-gray-400">{message.timestamp}</span>
                          </div>
                          <p className="text-white text-sm break-words">{message.message}</p>
                          {renderMessageAttachments(message)}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* منطقة المرفقات */}
                {adminAttachments.length > 0 && (
                  <div className="border border-white/20 rounded-lg p-3 bg-white/5 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {adminAttachments.map((attachment, index) => (
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
                                onClick={() => removeAdminAttachment(index)}
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
                                onClick={() => removeAdminAttachment(index)}
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
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-white/10 border-white/20 text-white resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="admin-media-upload"
                        disabled={isLoading}
                      />
                      <label htmlFor="admin-media-upload">
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                          className="bg-white/10 border-white/20 hover:bg-white/20"
                          asChild
                        >
                          <span className="cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            رفع ملف
                          </span>
                        </Button>
                      </label>
                    </div>
                    <Button 
                      onClick={handleSendReply}
                      disabled={(!newMessage.trim() && adminAttachments.length === 0) || isLoading}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="w-4 h-4 ml-2" />
                      إرسال الرد
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">اختر محادثة لبدء الرد</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            إدارة العملاء ({customers.length})
          </CardTitle>
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="ابحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-white/10 border-white/20 text-white"
            />
            <Button onClick={loadCustomers} size="sm" className="bg-blue-500/20 hover:bg-blue-500/30">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="active">العملاء النشطين</TabsTrigger>
              <TabsTrigger value="all">جميع العملاء</TabsTrigger>
              <TabsTrigger value="blocked">المحظورين</TabsTrigger>
              <TabsTrigger value="attempts">محاولات الدخول</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">الحالة</th>
                      <th className="text-right text-gray-300 p-2">آخر ظهور</th>
                      <th className="text-right text-gray-300 p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.filter(c => c.isOnline).map((customer) => (
                      <tr key={customer.id} className="border-white/10 hover:bg-white/5">
                        <td className="text-white p-2">{customer.email}</td>
                        <td className="p-2">
                          <Badge variant="default" className="bg-green-500">متصل</Badge>
                        </td>
                        <td className="text-gray-300 p-2">{customer.lastSeen}</td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Button
                              onClick={() => handleBlockCustomer(customer.id)}
                              variant="outline"
                              size="icon"
                              className="hover:bg-red-500/10 text-red-400"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => setSelectedCustomer(customer)}
                              variant="outline"
                              size="icon"
                              className="hover:bg-blue-500/10 text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">تاريخ التسجيل</th>
                      <th className="text-right text-gray-300 p-2">الحالة</th>
                      <th className="text-right text-gray-300 p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-white/10 hover:bg-white/5">
                        <td className="text-white p-2">{customer.email}</td>
                        <td className="text-gray-300 p-2">{customer.createdAt}</td>
                        <td className="p-2">
                          {customer.isOnline ? (
                            <Badge variant="default" className="bg-green-500">متصل</Badge>
                          ) : customer.isBlocked ? (
                            <Badge variant="destructive">محظور</Badge>
                          ) : (
                            <Badge variant="secondary">غير متصل</Badge>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Button
                              onClick={() => handleBlockCustomer(customer.id)}
                              variant="outline"
                              size="icon"
                              className="hover:bg-red-500/10 text-red-400"
                            >
                              {customer.isBlocked ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => handleDeleteCustomer(customer.id)}
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
              </div>
            </TabsContent>

            <TabsContent value="blocked" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">تاريخ الحظر</th>
                      <th className="text-right text-gray-300 p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.filter(c => c.isBlocked).map((customer) => (
                      <tr key={customer.id} className="border-white/10 hover:bg-white/5">
                        <td className="text-white p-2">{customer.email}</td>
                        <td className="text-gray-300 p-2">{customer.lastSeen}</td>
                        <td className="p-2">
                          <Button
                            onClick={() => handleBlockCustomer(customer.id)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-500/10 text-green-400"
                          >
                            إلغاء الحظر
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customers.filter(c => c.isBlocked).length === 0 && (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">لا يوجد عملاء محظورين</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attempts" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">الوقت</th>
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">النتيجة</th>
                      <th className="text-right text-gray-300 p-2">عنوان IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginAttempts.slice(0, 20).map((attempt) => (
                      <tr key={attempt.id} className="border-white/10">
                        <td className="text-gray-300 p-2">{attempt.timestamp}</td>
                        <td className="text-white p-2">{attempt.email}</td>
                        <td className="p-2">
                          {attempt.success ? (
                            <Badge variant="default" className="bg-green-500">نجح</Badge>
                          ) : (
                            <Badge variant="destructive">فشل</Badge>
                          )}
                        </td>
                        <td className="text-gray-400 p-2">{attempt.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loginAttempts.length === 0 && (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">لا توجد محاولات دخول</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedCustomer && (
        <Card className="bg-white/5 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">تفاصيل العميل</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
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
                  {selectedCustomer.isOnline ? 'متصل' : selectedCustomer.isBlocked ? 'محظور' : 'غير متصل'}
                </p>
              </div>
              <div>
                <h4 className="text-gray-400 mb-2">كلمة السر</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={selectedCustomer.password || "غير متوفرة"}
                    readOnly
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-gray-400 mb-2">معرف العميل</h4>
                <p className="text-white">#{selectedCustomer.id}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">معلومات الأمان</span>
              </div>
              <p className="text-blue-300 text-sm">
                يمكنك الآن رؤية كلمة سر العميل ومعلوماته الحساسة. تأكد من الحفاظ على سرية هذه المعلومات.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">متوسط وقت الاستجابة</p>
                <p className="text-2xl font-bold text-white">{getResponseTimeAverage()}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm font-medium">معدل الرضا</p>
                <p className="text-2xl font-bold text-white">4.8/5</p>
              </div>
              <Star className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border-pink-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-medium">إجمالي المحادثات</p>
                <p className="text-2xl font-bold text-white">{chatSessions.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">تقارير مفصلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">التقارير التفصيلية قيد التطوير</p>
            <p className="text-gray-500 text-sm">ستتوفر المزيد من التقارير والإحصائيات قريباً</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">إعدادات خدمة العملاء</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">إعدادات الإشعارات</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 rtl:space-x-reverse">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-gray-300">إشعار عند وصول رسالة جديدة</span>
              </label>
              <label className="flex items-center space-x-3 rtl:space-x-reverse">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-gray-300">إشعار عند انتظار العميل لفترة طويلة</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">إعدادات التلقائية</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 rtl:space-x-reverse">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">رد تلقائي عند بدء المحادثة</span>
              </label>
              <label className="flex items-center space-x-3 rtl:space-x-reverse">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">إغلاق تلقائي للمحادثات غير النشطة</span>
              </label>
            </div>
          </div>

          <Button onClick={saveSiteSettings} className="bg-green-500 hover:bg-green-600">
            حفظ الإعدادات
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          مركز خدمة العملاء المتطور
        </h2>
        <div className="flex gap-2">
          {getTotalUnreadCount() > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {getTotalUnreadCount()} رسالة جديدة
            </Badge>
          )}
        </div>
      </div>

      {/* شريط التبويبات */}
      <Card className="bg-white/5 backdrop-blur-md border-white/20">
        <CardContent className="p-4">
          <div className="flex space-x-4 rtl:space-x-reverse">
            {[
              { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { key: 'messages', label: 'الرسائل', icon: MessageCircle },
              { key: 'customers', label: 'العملاء', icon: Users },
              { key: 'analytics', label: 'التحليلات', icon: TrendingUp },
              { key: 'settings', label: 'الإعدادات', icon: Settings }
            ].map((tab) => (
              <Button
                key={tab.key}
                onClick={() => setActiveView(tab.key as any)}
                variant={activeView === tab.key ? 'default' : 'ghost'}
                className={`flex items-center gap-2 ${
                  activeView === tab.key 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* المحتوى */}
      <div className="min-h-[500px]">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'messages' && renderMessages()}
        {activeView === 'customers' && renderCustomers()}
        {activeView === 'analytics' && renderAnalytics()}
        {activeView === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default CustomerSupportTab;
