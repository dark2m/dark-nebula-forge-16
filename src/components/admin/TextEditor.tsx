
import React, { useState, useEffect } from 'react';
import { Bold, Italic, Underline, Type, Palette, RotateCcw, Save } from 'lucide-react';

interface TextStyle {
  fontSize: string;
  fontWeight: string;
  color: string;
  textAlign: string;
  textDecoration: string;
}

interface TextData {
  content: string;
  style?: TextStyle;
}

interface TextEditorProps {
  value: string | TextData;
  onChange: (value: string | TextData) => void;
  placeholder?: string;
  label: string;
  showColorPicker?: boolean;
  showSizeControl?: boolean;
  allowStyleSaving?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  label,
  showColorPicker = true,
  showSizeControl = true,
  allowStyleSaving = false
}) => {
  // تحديد ما إذا كان القيمة نص بسيط أم كائن مع تنسيق
  const isTextData = typeof value === 'object' && value !== null && 'content' in value;
  const textContent = isTextData ? (value as TextData).content : (value as string);
  const savedStyle = isTextData ? (value as TextData).style : null;

  const [fontSize, setFontSize] = useState(savedStyle?.fontSize || '16');
  const [fontWeight, setFontWeight] = useState(savedStyle?.fontWeight || 'normal');
  const [textColor, setTextColor] = useState(savedStyle?.color || '#ffffff');
  const [textAlign, setTextAlign] = useState(savedStyle?.textAlign || 'right');
  const [textDecoration, setTextDecoration] = useState(savedStyle?.textDecoration || 'none');

  // تحديث القيم عند تغيير value من الخارج
  useEffect(() => {
    if (isTextData && (value as TextData).style) {
      const style = (value as TextData).style!;
      setFontSize(style.fontSize || '16');
      setFontWeight(style.fontWeight || 'normal');
      setTextColor(style.color || '#ffffff');
      setTextAlign(style.textAlign || 'right');
      setTextDecoration(style.textDecoration || 'none');
    }
  }, [value, isTextData]);

  const applyStyle = (style: string) => {
    switch (style) {
      case 'bold':
        const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
        setFontWeight(newWeight);
        updateValue(textContent, { fontSize, fontWeight: newWeight, color: textColor, textAlign, textDecoration });
        break;
      case 'underline':
        const newDecoration = textDecoration === 'underline' ? 'none' : 'underline';
        setTextDecoration(newDecoration);
        updateValue(textContent, { fontSize, fontWeight, color: textColor, textAlign, textDecoration: newDecoration });
        break;
    }
  };

  const updateValue = (content: string, style?: TextStyle) => {
    if (allowStyleSaving && style) {
      onChange({ content, style });
    } else {
      onChange(content);
    }
  };

  const handleTextChange = (newText: string) => {
    updateValue(newText, allowStyleSaving ? { fontSize, fontWeight, color: textColor, textAlign, textDecoration } : undefined);
  };

  const handleStyleChange = (styleKey: keyof TextStyle, styleValue: string) => {
    const newStyle = { fontSize, fontWeight, color: textColor, textAlign, textDecoration, [styleKey]: styleValue };
    
    switch (styleKey) {
      case 'fontSize':
        setFontSize(styleValue);
        break;
      case 'fontWeight':
        setFontWeight(styleValue);
        break;
      case 'color':
        setTextColor(styleValue);
        break;
      case 'textAlign':
        setTextAlign(styleValue);
        break;
      case 'textDecoration':
        setTextDecoration(styleValue);
        break;
    }

    if (allowStyleSaving) {
      updateValue(textContent, newStyle);
    }
  };

  const resetStyles = () => {
    setFontSize('16');
    setFontWeight('normal');
    setTextColor('#ffffff');
    setTextAlign('right');
    setTextDecoration('none');
    
    if (allowStyleSaving) {
      updateValue(textContent, { fontSize: '16', fontWeight: 'normal', color: '#ffffff', textAlign: 'right', textDecoration: 'none' });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-gray-400 text-sm font-medium">{label}</label>
      
      {/* أدوات التحكم */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-800 rounded-lg border border-white/20">
        {/* التحكم في الحجم */}
        {showSizeControl && (
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-400" />
            <select
              value={fontSize}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="bg-gray-700 text-white border border-white/20 rounded px-2 py-1 text-sm"
            >
              <option value="12" className="bg-gray-700 text-white">12px</option>
              <option value="14" className="bg-gray-700 text-white">14px</option>
              <option value="16" className="bg-gray-700 text-white">16px</option>
              <option value="18" className="bg-gray-700 text-white">18px</option>
              <option value="20" className="bg-gray-700 text-white">20px</option>
              <option value="24" className="bg-gray-700 text-white">24px</option>
              <option value="28" className="bg-gray-700 text-white">28px</option>
              <option value="32" className="bg-gray-700 text-white">32px</option>
              <option value="36" className="bg-gray-700 text-white">36px</option>
              <option value="48" className="bg-gray-700 text-white">48px</option>
              <option value="64" className="bg-gray-700 text-white">64px</option>
            </select>
          </div>
        )}

        {/* أزرار التنسيق */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => applyStyle('bold')}
            className={`p-2 rounded transition-colors ${
              fontWeight === 'bold' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyStyle('underline')}
            className={`p-2 rounded transition-colors ${
              textDecoration === 'underline' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* اختيار اللون */}
        {showColorPicker && (
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-8 h-8 rounded border border-white/20 cursor-pointer"
            />
          </div>
        )}

        {/* محاذاة النص */}
        <select
          value={textAlign}
          onChange={(e) => handleStyleChange('textAlign', e.target.value)}
          className="bg-gray-700 text-white border border-white/20 rounded px-2 py-1 text-sm"
        >
          <option value="right" className="bg-gray-700 text-white">يمين</option>
          <option value="center" className="bg-gray-700 text-white">وسط</option>
          <option value="left" className="bg-gray-700 text-white">يسار</option>
        </select>

        {/* إعادة تعيين */}
        <button
          onClick={resetStyles}
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          title="إعادة تعيين التنسيق"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* منطقة النص */}
      <div className="relative">
        <textarea
          value={textContent}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: fontWeight,
            color: textColor,
            textAlign: textAlign as any,
            textDecoration: textDecoration
          }}
          className="w-full bg-gray-800 text-white border border-white/20 rounded px-3 py-3 min-h-[120px] resize-none focus:outline-none focus:border-blue-400 transition-colors"
        />
        
        {/* معاينة مباشرة */}
        <div className="mt-2 p-3 bg-gray-900 rounded border border-white/10">
          <div className="text-xs text-gray-400 mb-2">معاينة:</div>
          <div
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              color: textColor,
              textAlign: textAlign as any,
              textDecoration: textDecoration
            }}
          >
            {textContent || placeholder || 'نص تجريبي...'}
          </div>
        </div>
      </div>

      {allowStyleSaving && (
        <div className="text-xs text-blue-400">
          💡 سيتم حفظ تنسيق النص مع المحتوى
        </div>
      )}
    </div>
  );
};

export default TextEditor;
