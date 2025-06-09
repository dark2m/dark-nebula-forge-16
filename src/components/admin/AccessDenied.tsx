
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AccessDenied: React.FC = () => {
  return (
    <div className="admin-card rounded-xl p-8 text-center">
      <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">غير مسموح</h3>
      <p className="text-gray-300">
        ليس لديك الصلاحية للوصول إلى هذا القسم
      </p>
    </div>
  );
};

export default AccessDenied;
