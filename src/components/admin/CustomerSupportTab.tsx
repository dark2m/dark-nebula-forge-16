import React, { useState, useEffect } from 'react';
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
  Bell,
  Filter,
  Search,
  Download,
  RefreshCw,
  BarChart3,
  Calendar,
  Star,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import CustomerChatService, { type ChatSession } from '../../utils/customerChatService';
import { useToast } from '@/hooks/use-toast';

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
  const [activeView, setActiveView] = useState<'overview' | 'messages' | 'analytics' | 'settings'>('overview');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'waiting' | 'closed'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadChatSessions();
    const interval = setInterval(loadChatSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadChatSessions = () => {
    const sessions = CustomerChatService.getChatSessions();
    setChatSessions(sessions);
  };

  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = session.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendReply = async () => {
    if (!selectedSession || !newMessage.trim()) return;

    setIsLoading(true);
    const success = CustomerChatService.sendAdminMessage(selectedSession, newMessage);
    
    if (success) {
      setNewMessage('');
      loadChatSessions();
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

  const getTotalUnreadCount = () => {
    return chatSessions.reduce((total, session) => total + session.unreadCount, 0);
  };

  const getSessionsByStatus = (status: string) => {
    return chatSessions.filter(session => session.status === status).length;
  };

  const getResponseTimeAverage = () => {
    return "2.5 دقيقة"; // Mock data
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
                <p className="text-green-300 text-sm font-medium">تم الإغلاق</p>
                <p className="text-3xl font-bold text-white">{getSessionsByStatus('closed')}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-400" />
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
            أدوات إدارة سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => setActiveView('messages')}
              className="bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-white h-20 flex flex-col gap-2"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">إدارة الرسائل</span>
            </Button>
            
            <Button 
              onClick={() => setActiveView('analytics')}
              className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-white h-20 flex flex-col gap-2"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">التقارير</span>
            </Button>
            
            <Button 
              onClick={loadChatSessions}
              className="bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-white h-20 flex flex-col gap-2"
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

      {/* آخر المحادثات */}
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
    </div>
  );

  const renderMessages = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
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
                  onClick={() => setSelectedSession(session.customerId)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedSession === session.customerId
                      ? 'bg-blue-500/30 border-blue-500/50'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  } border`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium text-sm">{session.customerEmail}</p>
                    {session.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">{session.unreadCount}</Badge>
                    )}
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
              
              <CardContent className="flex-1 flex flex-col p-4">
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {CustomerChatService.getMessages(selectedSession).map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'support' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender === 'support' 
                            ? 'bg-green-500/20 border-green-500/30' 
                            : 'bg-blue-500/20 border-blue-500/30'
                        } border`}>
                          <div className="flex items-center gap-2 mb-1">
                            {message.sender === 'support' ? (
                              <UserCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <Users className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="text-xs text-gray-400">{message.timestamp}</span>
                          </div>
                          <p className="text-white text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-white/10 border-white/20 text-white resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSendReply}
                      disabled={!newMessage.trim() || isLoading}
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
          إدارة خدمة العملاء المتطورة
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
        {activeView === 'analytics' && renderAnalytics()}
        {activeView === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default CustomerSupportTab;
