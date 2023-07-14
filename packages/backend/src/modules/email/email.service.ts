import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import { Env } from '~/types';

@Injectable()
export class EmailService implements OnModuleDestroy {
  private readonly transport;
  private readonly sender;

  constructor(private readonly configService: ConfigService<Env>) {
    const { CONFIG, SENDER } = this.configService.getOrThrow<Env['EMAIL']>('EMAIL');

    // https://velog.io/@mimi0905/Nodemailer%EB%A1%9C-%EB%A9%94%EC%9D%BC-%EB%B3%B4%EB%82%B4%EA%B8%B0-with-%EC%B2%A8%EB%B6%80%ED%8C%8C%EC%9D%BC
    this.transport = createTransport({
      pool: true,
      secure: false,
      ...CONFIG,
    });

    this.sender = SENDER;
  }

  onModuleDestroy() {
    return this.transport.close();
  }

  sendEmail(receiver: string, title: string, body: string): Promise<SMTPPool.SentMessageInfo> {
    const mailOption: Mail.Options = {
      from: `MyTask <${this.sender}>`,
      sender: this.sender,
      to: receiver,
      subject: title,
      html: body,
    };

    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOption, (err, info) => (err ? reject(err) : resolve(info)));
    });
  }

  sendJoinEmail(receiver: string, uuid: string) {
    const { HOST, FE_PORT } = this.configService.getOrThrow<Env['NETWORK']>('NETWORK');
    const FE_ORIGIN = `http://${HOST}:${FE_PORT}`;

    return this.sendEmail(
      receiver,
      '[MyTask] Please verify your E-Mail!',
      `Click <a href="${FE_ORIGIN}/welcome/${uuid}">HERE</a> to verify your E-Mail!`,
    );
  }
}
