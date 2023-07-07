import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { Env } from '~/types';

@Injectable()
export class EmailService {
  constructor(configService: ConfigService<Env>) {
    // https://velog.io/@mimi0905/Nodemailer%EB%A1%9C-%EB%A9%94%EC%9D%BC-%EB%B3%B4%EB%82%B4%EA%B8%B0-with-%EC%B2%A8%EB%B6%80%ED%8C%8C%EC%9D%BC
    createTransport({
      host: configService.getOrThrow<Env['EMAIL_HREF']>('EMAIL_HREF'),
      port: configService.getOrThrow<Env['EMAIL_PORT']>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: configService.getOrThrow<Env['EMAIL_USER']>('EMAIL_USER'),
        pass: configService.getOrThrow<Env['EMAIL_PASS']>('EMAIL_PASS'),
      },
    });
  }
}
