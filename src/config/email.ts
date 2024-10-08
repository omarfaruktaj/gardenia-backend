import nodemailer from 'nodemailer';
import env from './env';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class Email {
  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: env.SENDER_EMAIL,
          pass: env.SENDER_APP_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: Number(env.EMAIL_PORT),
      secure: false,
      auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  async send(options: EmailOptions) {
    const { to, subject, html, text } = options;

    const mailOptions = {
      to,
      subject,
      html,
      text,
      from: `Gardenia <${env.EMAIL_FROM}>`,
    };

    const info = await this.newTransporter().sendMail(mailOptions);
    console.log('Message sent: %s', info);
    console.log(nodemailer.getTestMessageUrl(info));
  }
}
