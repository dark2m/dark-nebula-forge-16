
import emailjs from '@emailjs/browser';

class EmailService {
  private static SERVICE_ID = 'service_awokfdw';
  private static TEMPLATE_ID = 'template_verification';
  private static PUBLIC_KEY = 'gQqOCBJE7yOXwc0gG'; // مفتاح حقيقي من EmailJS

  static async sendVerificationCode(email: string, verificationCode: string): Promise<boolean> {
    try {
      // التحقق من وجود المفاتيح المطلوبة
      if (!this.PUBLIC_KEY || this.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.error('EmailJS Public Key is not configured properly');
        return false;
      }

      const templateParams = {
        to_email: email,
        verification_code: verificationCode,
        to_name: email.split('@')[0]
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      );

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      // في حالة الخطأ، نعيد false بدلاً من التوقف
      return false;
    }
  }

  // توليد كود بسيط من 4 أرقام
  static generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

export default EmailService;
