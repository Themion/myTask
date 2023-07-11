import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Env } from '~/types';

@Injectable()
export class EmailService implements OnModuleDestroy {
  private readonly transport;
  private readonly sender;

  constructor(private readonly configService: ConfigService<Env>) {
    // https://velog.io/@mimi0905/Nodemailer%EB%A1%9C-%EB%A9%94%EC%9D%BC-%EB%B3%B4%EB%82%B4%EA%B8%B0-with-%EC%B2%A8%EB%B6%80%ED%8C%8C%EC%9D%BC
    this.transport = createTransport({
      pool: true,
      host: this.configService.getOrThrow<Env['EMAIL_HREF']>('EMAIL_HREF'),
      port: this.configService.getOrThrow<Env['EMAIL_PORT']>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.getOrThrow<Env['EMAIL_USER']>('EMAIL_USER'),
        pass: this.configService.getOrThrow<Env['EMAIL_PASS']>('EMAIL_PASS'),
      },
    });

    this.sender = this.configService.getOrThrow<Env['EMAIL_ADDRESS']>('EMAIL_ADDRESS');
  }

  onModuleDestroy() {
    return this.transport.close();
  }

  sendEmail(target: string, title: string, body: string) {
    const mailOption: Mail.Options = {
      from: `MyTask <${this.sender}>`,
      sender: this.sender,
      to: target,
      subject: title,
      html: body,
    };

    return this.transport.sendMail(mailOption);
  }

  sendJoinEmail(target: string, uuid: string) {
    const HOST = this.configService.getOrThrow<Env['HOST']>('HOST');
    const FE_PORT = this.configService.getOrThrow<Env['FE_PORT']>('FE_PORT');
    const FE_ORIGIN = `http://${HOST}:${FE_PORT}`;

    return this.sendEmail(
      target,
      '[MyTask] Please verify your E-Mail!',
      `Click <a href="${FE_ORIGIN}/welcome/${uuid}">HERE</a> to verify your E-Mail!`,
    );
  }
}
