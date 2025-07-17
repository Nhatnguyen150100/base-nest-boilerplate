import { AppConfig } from '@/config';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import path = require('path');
import * as fs from 'fs';
import Handlebars = require('handlebars');
import { MAIL_TEMPLATE_PATH } from '../module/mail/mail.constants';

@Injectable()
export class MailService {
  constructor(private readonly appConfig: AppConfig) {}
  private readonly logger = new Logger(MailService.name);

  private transporter = nodemailer.createTransport({
    host: this.appConfig.mailConfig.host,
    port: +this.appConfig.mailConfig.port!,
    secure: false,
    tls: { rejectUnauthorized: false },
    auth: {
      user: this.appConfig.mailConfig.username,
      pass: this.appConfig.mailConfig.password,
    },
  });

  private compileTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    const templatePath = path.join(MAIL_TEMPLATE_PATH, `${templateName}.html`);
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiled = Handlebars.compile(template);
    return compiled(context);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.appConfig.mailConfig.mailFrom,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <h1>Welcome, ${name}!</h1>
      <p>Thanks for joining our platform.</p>
    `;
    await this.sendMail(to, 'Welcome to Our App!', html);
  }

  async sendOtpEmail(to: string, otp: string, name?: string) {
    const html = this.compileTemplate('otp-email', {
      otp,
      name: name || 'User',
    });
    await this.sendMail(to, 'OTP Verification', html);
  }
}
