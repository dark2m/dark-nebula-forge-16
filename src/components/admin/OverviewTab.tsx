
import React from 'react';
import { BarChart3, Package, Users } from 'lucide-react';
import { Product } from '../../utils/adminStorage';

interface OverviewTabProps {
  products: Product[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ products }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">نظرة عامة</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="admin-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-white">1,234$</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="admin-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">عدد المنتجات</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="admin-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">العملاء النشطين</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
