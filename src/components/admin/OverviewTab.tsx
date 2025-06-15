
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Users, ShoppingCart, Eye, Edit, Save, X, Loader2 } from 'lucide-react';
import { useAdminOverviewData } from '../../hooks/useAdminOverviewData';
import type { Product } from '../../types/admin';

interface OverviewTabProps {
  products: Product[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ products }) => {
  const { 
    salesData, 
    isLoading, 
    isSaving, 
    updateSalesData 
  } = useAdminOverviewData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(salesData);

  React.useEffect(() => {
    setEditedData(salesData);
  }, [salesData]);

  const handleSave = async () => {
    const success = await updateSalesData(editedData);
    if (success) {
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditedData(salesData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: number) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-white">جاري تحميل بيانات النظرة العامة...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: isEditing ? editedData.totalSales : salesData.totalSales,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      field: 'totalSales'
    },
    {
      title: 'الإيرادات الشهرية',
      value: isEditing ? editedData.monthlyRevenue : salesData.monthlyRevenue,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      field: 'monthlyRevenue'
    },
    {
      title: 'الطلبات المعلقة',
      value: isEditing ? editedData.pendingOrders : salesData.pendingOrders,
      icon: ShoppingCart,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      field: 'pendingOrders'
    },
    {
      title: 'الطلبات المكتملة',
      value: isEditing ? editedData.completedOrders : salesData.completedOrders,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      field: 'completedOrders'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">نظرة عامة</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="glow-button flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ للجميع
                  </>
                )}
              </button>
              <button
                onClick={cancelEdit}
                disabled={isSaving}
                className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                إلغاء
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="glow-button flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل المبيعات
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="admin-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedData[stat.field as keyof typeof editedData]}
                      onChange={(e) => handleInputChange(stat.field, Number(e.target.value))}
                      className="text-2xl font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 mt-1 w-full"
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Products Overview */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          إحصائيات المنتجات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{products.length}</p>
            <p className="text-gray-400">إجمالي المنتجات</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{products.filter(p => p.category === 'pubg').length}</p>
            <p className="text-gray-400">هكر ببجي</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{products.filter(p => p.category === 'web').length + products.filter(p => p.category === 'discord').length}</p>
            <p className="text-gray-400">خدمات البرمجة</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">النشاط الأخير</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm">تم تحديث بيانات المبيعات</p>
              <p className="text-gray-400 text-xs">محفوظة في قاعدة البيانات</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm">مستخدم جديد انضم</p>
              <p className="text-gray-400 text-xs">منذ ساعة</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-white text-sm">طلب جديد في الانتظار</p>
              <p className="text-gray-400 text-xs">منذ ساعتين</p>
            </div>
          </div>
        </div>
      </div>

      {isSaving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-white">جاري الحفظ في قاعدة البيانات...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
