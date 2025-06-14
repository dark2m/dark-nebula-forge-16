
import emailjs from '@emailjs/browser';

class EmailService {
  private static SERVICE_ID = 'service_awokfdw';
  private static TEMPLATE_ID = 'template_verification';
  private static PUBLIC_KEY = 'gQqOCBJE7yOXwc0gG';

  static async sendVerificationLink(email: string, verificationLink: string): Promise<boolean> {
    try {
      if (!this.PUBLIC_KEY || this.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.error('EmailJS Public Key is not configured properly');
        return false;
      }

      const templateParams = {
        to_email: email,
        verification_link: verificationLink,
        to_name: email.split('@')[0],
        message: `مرحباً بك في خدمة العملاء. لتأكيد بريدك الإلكتروني والحصول على الدعم الفني، يرجى النقر على الرابط التالي: ${verificationLink}`
      };

      console.log('Sending verification email with params:', templateParams);

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      );

      console.log('Verification email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }

  static generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // للتوافق مع النظام القديم
  static async sendVerificationCode(email: string, verificationCode: string): Promise<boolean> {
    return this.sendVerificationLink(email, `كود التحقق: ${verificationCode}`);
  }
}

export default EmailService;
