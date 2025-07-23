import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EmailFactory } from './email.factory';

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(private configService: ConfigService, private emailFactory: EmailFactory) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      requireTLS: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false, // Temporarily set for debugging SSL issues
      },
    });
  }

  async sendMail(to: string, subject: string, templateName: string, templateData: Record<string, any>) {
    const html = await this.emailFactory.renderTemplate(templateName, templateData);

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
