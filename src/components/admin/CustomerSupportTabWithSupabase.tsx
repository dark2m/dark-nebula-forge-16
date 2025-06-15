
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
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSupabaseCustomerSupport } from '@/hooks/useSupabaseCustomerSupport';
import type { CustomerSupportUser, CustomerSupportMessage } from '@/utils/supabaseCustomerSupportService';

interface CustomerSupportTabWithSupabaseProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const CustomerSupportTabWithSupabase: React.FC<CustomerSupportTabWithSupabaseProps> = ({ 
  siteSettings, 
  setSiteSettings, 
  saveSiteSettings 
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'messages' | 'customers' | 'analytics' | 'settings'>('overview');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSupportUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'waiting' | 'closed'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<CustomerSupportMessage[]>([]);
  const [adminAttachments, setAdminAttachments] = useState<{ type: 'image' | 'video', data: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  
  const {
    customers,
    sessions,
    loginAttempts,
    loading,
    error,
    loadData,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    sendMessage,
    getMessages,
    markMessagesAsRead,
    closeSession,
    deleteSession,
    authenticateCustomer,
  } = useSupabaseCustomerSupport();

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const filteredSessions = sessions.filter(session => {
    const customer = customers.find(c => c.id === session.customer_id);
    const matchesSearch = customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.customer_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = async () => {
    if (!selectedSession || (!newMessage.trim() && adminAttachments.length === 0)) return;

    setIsLoading(true);
    const result = await sendMessage({
      customer_id: selectedSession,
      message: newMessage,
      attachments: adminAttachments,
      is_from_customer: false,
    });
    
    if (result) {
      setNewMessage('');
      setAdminAttachments([]);
      const messages = await getMessages(selectedSession);
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

  const handleCloseSession = async (customerId: string) => {
    const success = await closeSession(customerId);
    if (success) {
      toast({
        title: "تم إغلاق المحادثة",
        description: "تم إغلاق المحادثة بنجاح"
      });
    }
  };

  const handleDeleteCustomerChat = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const confirmDelete = window.confirm(`هل أنت متأكد أنك تريد حذف محادثة ${customer.email}؟ هذا الإجراء لا يمكن التراجع عنه.`);
    if (!confirmDelete) return;

    const success = await deleteSession(customerId);
    if (success) {
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

  const handleBlockCustomer = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const newBlockedStatus = !customer.is_blocked;
    const success = await updateCustomer(customerId, { is_blocked: newBlockedStatus });
    
    if (success) {
      toast({
        title: newBlockedStatus ? "تم حظر العميل" : "تم إلغاء حظر العميل",
        description: newBlockedStatus
          ? `تم حظر ${customer.email} بنجاح.`
          : `تم إلغاء حظر ${customer.email} بنجاح.`,
      });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    if (!customerToDelete) return;

    const confirmDelete = window.confirm(`هل أنت متأكد أنك تريد حذف ${customerToDelete.email}؟`);
    if (!confirmDelete) return;

    const success = await deleteCustomer(customerId);
    if (success) {
      toast({
        title: "تم حذف العميل",
        description: `تم حذف ${customerToDelete.email} بنجاح.`,
      });
    }
  };

  const handleSelectSession = async (session: any) => {
    setSelectedSession(session.customer_id);
    const messages = await getMessages(session.customer_id);
    setCurrentMessages(messages);
    await markMessagesAsRead(session.customer_id);
  };

  const getTotalUnreadCount = () => {
    return sessions.reduce((total, session) => total + session.unread_count, 0);
  };

  const getSessionsByStatus = (status: string) => {
    return sessions.filter(session => session.status === status).length;
  };

  const getResponseTimeAverage = () => {
    return "2.5 دقيقة";
  };

  const renderMessageAttachments = (message: CustomerSupportMessage) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{error}</p>
          <Button onClick={loadData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          مركز خدمة العملاء المتطور (قاعدة البيانات)
        </h2>
        <div className="flex gap-2">
          {getTotalUnreadCount() > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {getTotalUnreadCount()} رسالة جديدة
            </Badge>
          )}
          <Button onClick={loadData} size="sm" className="bg-blue-500/20 hover:bg-blue-500/30">
            <RefreshCw className="w-4 h-4" />
          </Button>
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
        {activeView === 'overview' && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-white text-lg">نظام خدمة العملاء متصل بقاعدة البيانات</p>
            <p className="text-gray-400 text-sm">العملاء: {customers.length} | الجلسات: {sessions.length} | محاولات الدخول: {loginAttempts.length}</p>
          </div>
        )}
        
        {activeView === 'customers' && (
          <Card className="bg-white/5 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">إدارة العملاء ({customers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-white/10">
                      <th className="text-right text-gray-300 p-2">البريد الإلكتروني</th>
                      <th className="text-right text-gray-300 p-2">اسم المستخدم</th>
                      <th className="text-right text-gray-300 p-2">كلمة المرور</th>
                      <th className="text-right text-gray-300 p-2">تاريخ التسجيل</th>
                      <th className="text-right text-gray-300 p-2">الحالة</th>
                      <th className="text-right text-gray-300 p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-white/10 hover:bg-white/5">
                        <td className="text-white p-2">{customer.email}</td>
                        <td className="text-white p-2">{customer.username || 'غير محدد'}</td>
                        <td className="text-white p-2">
                          <div className="flex items-center gap-2">
                            <span className={showPassword ? '' : 'blur-sm'}>
                              {customer.password_hash || 'غير متوفرة'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </td>
                        <td className="text-gray-300 p-2">{new Date(customer.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-2">
                          {customer.is_blocked ? (
                            <Badge variant="destructive">محظور</Badge>
                          ) : customer.is_verified ? (
                            <Badge variant="default" className="bg-green-500">مفعل</Badge>
                          ) : (
                            <Badge variant="secondary">غير مفعل</Badge>
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
                              {customer.is_blocked ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => setSelectedCustomer(customer)}
                              variant="outline"
                              size="icon"
                              className="hover:bg-blue-500/10 text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
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
            </CardContent>
          </Card>
        )}

        {activeView === 'messages' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">واجهة الرسائل قيد التطوير</p>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">التحليلات قيد التطوير</p>
          </div>
        )}

        {activeView === 'settings' && (
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

              <Button onClick={saveSiteSettings} className="bg-green-500 hover:bg-green-600">
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

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
                <h4 className="text-gray-400 mb-2">اسم المستخدم</h4>
                <p className="text-white">{selectedCustomer.username || 'غير محدد'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 mb-2">تاريخ التسجيل</h4>
                <p className="text-white">{new Date(selectedCustomer.created_at).toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                <h4 className="text-gray-400 mb-2">آخر دخول</h4>
                <p className="text-white">{selectedCustomer.last_login ? new Date(selectedCustomer.last_login).toLocaleDateString('ar-SA') : 'لم يسجل دخول بعد'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 mb-2">الحالة</h4>
                <p className="text-white">
                  {selectedCustomer.is_blocked ? 'محظور' : selectedCustomer.is_verified ? 'مفعل' : 'غير مفعل'}
                </p>
              </div>
              <div>
                <h4 className="text-gray-400 mb-2">معرف العميل</h4>
                <p className="text-white">#{selectedCustomer.id}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">البيانات محفوظة في قاعدة البيانات</span>
              </div>
              <p className="text-blue-300 text-sm">
                جميع البيانات محفوظة بشكل دائم ومشتركة بين جميع المستخدمين.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerSupportTabWithSupabase;
