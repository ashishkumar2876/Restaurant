import { transactionalEmailApi, sender } from './brevo';
import {
  generatePasswordResetEmailHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent
} from './htmlEmail';

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  try {
    const sendSmtpEmail = {
      sender,
      to: [{ email }],
      subject: 'Verify your Email',
      htmlContent: htmlContent.replace('{verificationToken}', verificationToken),
    };

    const response = await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    
  } catch (error) {
    
    throw new Error('Failed to send email verification');
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const html = generateWelcomeEmailHtml(name);
    const sendSmtpEmail = {
      sender,
      to: [{ email }],
      subject: 'Welcome to Ashish Eats',
      htmlContent: html,
    };

    const response = await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    
  } catch (error) {
    
    throw new Error('Failed to send welcome email');
  }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
  try {
    const html = generatePasswordResetEmailHtml(resetURL);
    const sendSmtpEmail = {
      sender,
      to: [{ email }],
      subject: 'Reset your password',
      htmlContent: html,
    };

    const response = await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    
  } catch (error) {
  
    throw new Error('Failed to send password reset email');
  }
};

export const sendResetSuccessEmail = async (email: string) => {
  try {
    const html = generateResetSuccessEmailHtml();
    const sendSmtpEmail = {
      sender,
      to: [{ email }],
      subject: 'Password Reset Successfully',
      htmlContent: html,
    };

    const response = await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    
  } catch (error) {
    
    throw new Error('Failed to send password reset success email');
  }
};
