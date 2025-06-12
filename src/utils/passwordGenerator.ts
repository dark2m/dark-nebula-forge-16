
export class PasswordGenerator {
  private static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly NUMBERS = '0123456789';
  private static readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  static generate(options: {
    length?: number;
    includeLowercase?: boolean;
    includeUppercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    excludeSimilar?: boolean;
  } = {}): string {
    const {
      length = 12,
      includeLowercase = true,
      includeUppercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = false
    } = options;

    let charset = '';
    
    if (includeLowercase) charset += this.LOWERCASE;
    if (includeUppercase) charset += this.UPPERCASE;
    if (includeNumbers) charset += this.NUMBERS;
    if (includeSymbols) charset += this.SYMBOLS;

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    if (charset === '') {
      throw new Error('يجب تحديد نوع واحد على الأقل من الأحرف');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  static generateMultiple(count: number, options: Parameters<typeof PasswordGenerator.generate>[0] = {}): string[] {
    const passwords: string[] = [];
    for (let i = 0; i < count; i++) {
      passwords.push(this.generate(options));
    }
    return passwords;
  }

  static checkStrength(password: string): {
    score: number;
    level: 'ضعيف' | 'متوسط' | 'قوي' | 'قوي جداً';
    feedback: string[];
  } {
    let score = 0;
    const feedback: string[] = [];

    // طول كلمة المرور
    if (password.length >= 8) score += 1;
    else feedback.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');

    if (password.length >= 12) score += 1;

    // أحرف صغيرة
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('أضف أحرف صغيرة');

    // أحرف كبيرة
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('أضف أحرف كبيرة');

    // أرقام
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('أضف أرقام');

    // رموز
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('أضف رموز خاصة');

    // تنوع الأحرف
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 1;

    let level: 'ضعيف' | 'متوسط' | 'قوي' | 'قوي جداً';
    if (score <= 2) level = 'ضعيف';
    else if (score <= 4) level = 'متوسط';
    else if (score <= 6) level = 'قوي';
    else level = 'قوي جداً';

    return { score, level, feedback };
  }
}
