
export interface TextData {
  content: string;
  style?: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: string;
    textDecoration: string;
  };
}

/**
 * Safely extracts text content from either a string or TextData object
 */
export const getTextContent = (value: string | TextData | any): string => {
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object' && value !== null && 'content' in value) {
    return value.content;
  }
  
  // Fallback for any other type
  return String(value || '');
};

/**
 * Safely extracts style from TextData object
 */
export const getTextStyle = (value: string | TextData | any) => {
  if (typeof value === 'object' && value !== null && 'style' in value) {
    return value.style;
  }
  
  return null;
};

/**
 * Checks if a value is a TextData object
 */
export const isTextData = (value: any): value is TextData => {
  return typeof value === 'object' && value !== null && 'content' in value;
};
