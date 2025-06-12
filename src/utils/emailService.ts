
import emailjs from '@emailjs/browser';

class EmailService {
  private static SERVICE_ID = 'service_awokfdw';
  private static TEMPLATE_ID = 'template_verification'; // سيتم إنشاؤه في EmailJS
  private static PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // سيحتاج المستخدم لإضافته

  static async sendVerificationCode(email: string, verificationCode: string): Promise<boolean> {
    try {
      const templateParams = {
        to_email: email,
        verification_code: verificationCode,
        to_name: email.split('@')[0]
      };

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
      return false;
    }
  }

  static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export default EmailService;
