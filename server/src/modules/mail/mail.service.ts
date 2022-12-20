import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { emailInterface } from './email.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(data: emailInterface) {
    await this.mailerService.sendMail({
      ...data
    });
  }
}
