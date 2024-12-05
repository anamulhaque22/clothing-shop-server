import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

import { MailerService } from 'src/mailer/mailer.service';
import { MailData } from './interfaces/mail-data.imterface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const emailConfirmTitle = 'Confirm email';
    const text1 = 'Hey!';
    const text2 = 'You’re almost ready to start enjoying';
    const text3 =
      'Simply click the big green button below to verify your email address.';

    const url = new URL(
      this.configService.getOrThrow('app.frontendCustomerDomain', {
        infer: true,
      }) + '/confirm-email',
    );

    url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', { infer: true }),
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.getOrThrow('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ): Promise<void> {
    const resetPasswordTitle: string = 'Reset Password';
    const text1: string = 'Trouble signing in?';
    const text2: string = 'Resetting your password is easy.';
    const text3: string =
      'Just press the button below and follow the instructions. We’ll have you up and running in no time.';
    const text4: string =
      'If you did not make this request then please ignore this email.';

    const url = new URL(
      this.configService.getOrThrow('app.frontendCustomerDomain', {
        infer: true,
      }) + '/password-change',
    );
    url.searchParams.set('hash', mailData.data.hash);
    url.searchParams.set('expires', mailData.data.tokenExpires.toString());

    this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url.toString()} ${resetPasswordTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', { infer: true }),
        'src',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async confirmNewEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    const confirmNewEmailTitle: string = 'Confirm email';
    const text1 = 'Hey!';
    const text2 = 'Confirm your new email address.';
    const text3 =
      'Simply click the big green button below to verify your email address.';

    const url = new URL(
      this.configService.getOrThrow('app.frontendCustomerDomain', {
        infer: true,
      }) + '/confirm-new-email',
    );

    url.searchParams.set('hash', mailData.data.hash);
    this.mailerService.sendMail({
      subject: confirmNewEmailTitle,
      text: `${url.toString()} ${confirmNewEmailTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', { infer: true }),
        'src',
        'mail',
        'mail-template',
        'confirm-new-email.hbs',
      ),
      context: {
        title: confirmNewEmailTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        url: url.toString(),
        actionTitle: confirmNewEmailTitle,
        text1,
        text2,
        text3,
      },
    });
  }
}
