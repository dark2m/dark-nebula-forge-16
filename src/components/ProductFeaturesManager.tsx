import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductFeaturesManagerProps {
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}

const ProductFeaturesManager: React.FC<ProductFeaturesManagerProps> = ({
  features,
  onFeaturesChange
}) => {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      onFeaturesChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    onFeaturesChange(updatedFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    onFeaturesChange(updatedFeatures);
  };

  return (
    <div className="space-y-3">
      <label className="block text-gray-400 text-sm mb-2">المميزات</label>
      
      {/* Existing features */}
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              className="flex-1 bg-transparent text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              placeholder="أدخل الميزة"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeFeature(index)}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new feature */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addFeature()}
          className="flex-1 bg-transparent text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
          placeholder="إضافة ميزة جديدة"
        />
        <Button
          type="button"
          onClick={addFeature}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 p-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductFeaturesManager;
