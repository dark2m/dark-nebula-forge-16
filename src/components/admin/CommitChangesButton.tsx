
import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PersistenceService from '@/utils/persistenceService';

const CommitChangesButton: React.FC = () => {
  const [hasPending, setHasPending] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // فحص التغييرات المعلقة عند التحميل
    setHasPending(PersistenceService.hasPendingChanges());

    // الاستماع لتحديثات التغييرات المعلقة
    const handlePendingChanges = (event: CustomEvent) => {
      setHasPending(event.detail.hasPending);
    };

    const handleChangesCommitted = () => {
      setHasPending(false);
      setIsCommitting(false);
      toast({
        title: "تم تثبيت التغييرات",
        description: "تم حفظ جميع التعديلات بشكل دائم في الموقع",
        variant: "default"
      });
    };

    window.addEventListener('pendingChangesUpdated', handlePendingChanges as EventListener);
    window.addEventListener('changesCommitted', handleChangesCommitted as EventListener);

    return () => {
      window.removeEventListener('pendingChangesUpdated', handlePendingChanges as EventListener);
      window.removeEventListener('changesCommitted', handleChangesCommitted as EventListener);
    };
  }, [toast]);

  const handleCommit = async () => {
    if (!hasPending) return;

    setIsCommitting(true);
    
    try {
      const success = PersistenceService.commitChanges();
      
      if (success) {
        console.log('Changes committed successfully');
      } else {
        throw new Error('Failed to commit changes');
      }
    } catch (error) {
      console.error('Error committing changes:', error);
      toast({
        title: "خطأ في التثبيت",
        description: "حدث خطأ أثناء تثبيت التغييرات",
        variant: "destructive"
      });
      setIsCommitting(false);
    }
  };

  if (!hasPending) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleCommit}
        disabled={isCommitting}
        className={`
          flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-lg
          bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
          text-white font-semibold shadow-lg transform transition-all duration-200
          ${isCommitting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}
          animate-pulse border-2 border-green-400
        `}
      >
        {isCommitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>جاري التثبيت...</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>تثبيت التغييرات</span>
            <Save className="w-5 h-5" />
          </>
        )}
      </button>
      
      {hasPending && !isCommitting && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded text-sm whitespace-nowrap">
          يوجد تعديلات غير مثبتة
        </div>
      )}
    </div>
  );
};

export default CommitChangesButton;
