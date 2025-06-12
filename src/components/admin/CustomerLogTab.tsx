
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Eye, Shield, Clock, Ban, LogOut } from 'lucide-react';
import CustomerAuthService from '../../utils/customerAuthService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerUser {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  isVerified: boolean;
  isBlocked?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
}

const CustomerLogTab = () => {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
    
    // تحديث حالة الاتصال كل 30 ثانية
    const interval = setInterval(updateOnlineStatus, 30000);
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
    localStorage.setItem(`blocked_${customerId}`, 'true');
    loadCustomers();
    toast({
      title: "تم حظر العميل",
      description: "تم حظر العميل بنجاح"
    });
  };

  const unblockCustomer = (customerId: number) => {
    localStorage.removeItem(`blocked_${customerId}`);
    loadCustomers();
    toast({
      title: "تم إلغاء حظر العميل",
      description: "تم إلغاء حظر العميل بنجاح"
    });
  };

  const forceLogout = (customerId: number) => {
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
    const allCustomers = CustomerAuthService.getCustomers();
    const updatedCustomers = allCustomers.filter(c => c.id !== customerId);
    CustomerAuthService.saveCustomers(updatedCustomers);
    
    // تنظيف البيانات الإضافية
    localStorage.removeItem(`blocked_${customerId}`);
    localStorage.removeItem(`online_${customerId}`);
    localStorage.removeItem(`lastSeen_${customerId}`);
    
    loadCustomers();
    toast({
      title: "تم حذف العميل",
      description: "تم حذف العميل نهائياً"
    });
  };

  const getStatusBadge = (customer: CustomerUser) => {
    if (customer.isBlocked) {
      return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">محظور</span>;
    }
    if (customer.isOnline) {
      return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">متصل</span>;
    }
    return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">غير متصل</span>;
  };

  const onlineCustomers = customers.filter(c => c.isOnline && !c.isBlocked).length;
  const blockedCustomers = customers.filter(c => c.isBlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">سجل العملاء</h2>
        <Button 
          onClick={loadCustomers}
          className="glow-button"
        >
          تحديث البيانات
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <UserX className="w-5 h-5 text-red-400" />
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
      </div>

      {/* جدول العملاء */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            قائمة العملاء
          </CardTitle>
          <CardDescription className="text-gray-400">
            إدارة جميع العملاء المسجلين في النظام
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
                        {customer.isBlocked ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => unblockCustomer(customer.id)}
                            className="text-green-400 hover:text-green-300 p-1"
                            title="إلغاء الحظر"
                          >
                            <UserCheck className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => blockCustomer(customer.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="حظر العميل"
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
                          title="حذف العميل"
                        >
                          <UserX className="w-3 h-3" />
                        </Button>
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
    </div>
  );
};

export default CustomerLogTab;
