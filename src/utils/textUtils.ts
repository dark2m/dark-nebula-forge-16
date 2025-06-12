
export const getTextContent = (text: string | { [key: string]: string } | undefined): string => {
  if (!text) return '';
  
  if (typeof text === 'string') {
    return text;
  }
  
  if (typeof text === 'object') {
    // إذا كان النص كائن، نبحث عن النص الافتراضي أو الإنجليزي
    return text['ar'] || text['default'] || text['en'] || Object.values(text)[0] || '';
  }
  
  return String(text);
};

export const updateTextContent = (
  currentSettings: any,
  path: string[],
  newValue: string
): any => {
  const updatedSettings = { ...currentSettings };
  let current = updatedSettings;
  
  // التنقل عبر المسار حتى الوصول للعنصر الأخير
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) {
      current[path[i]] = {};
    }
    current = current[path[i]];
  }
  
  // تحديث القيمة
  current[path[path.length - 1]] = newValue;
  
  return updatedSettings;
};

export const validateTextStructure = (texts: any): boolean => {
  try {
    // التحقق من وجود الهيكل الأساسي
    if (!texts || typeof texts !== 'object') return false;
    
    const requiredSections = ['home', 'navigation', 'cart'];
    for (const section of requiredSections) {
      if (!texts[section]) return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating text structure:', error);
    return false;
  }
};
