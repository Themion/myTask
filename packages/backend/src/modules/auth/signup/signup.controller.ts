import { confirmSignUpDTOSchema, requestSignUpDTOSchema } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '~/modules/email/email.service';
import { GroupService } from '~/modules/group/group.service';
import { Env } from '~/types';
import { SignUpService } from './signup.service';

@Controller()
export class SignUpController {
  private readonly FE_ORIGIN: string;

  constructor(
    private readonly signUpService: SignUpService,
    private readonly groupService: GroupService,
    private readonly emailService: EmailService,
    configService: ConfigService<Env>,
  ) {
    const { HOST, FE_PORT } = configService.getOrThrow<Env['NETWORK']>('NETWORK');
    this.FE_ORIGIN = `http://${HOST}:${FE_PORT}`;
  }

  private sendSignUpEmail(receiver: string, uuid: string) {
    return this.emailService.sendEmail(
      receiver,
      '[MyTask] Please verify your E-Mail!',
      `Click <a href="${this.FE_ORIGIN}/welcome/${uuid}">HERE</a> to verify your E-Mail!`,
    );
  }

  @Post('syn')
  requestSignUpUser(@Body() body: any) {
    const result = requestSignUpDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = this.signUpService.requestSignUpUser(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.sendSignUpEmail(data.email, uuid);

    return data;
  }

  @Post('ack')
  async confirmSignUpUser(@Body() body: any) {
    const result = confirmSignUpDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const newUser = await this.signUpService.confirmSignUpUser(data);
    await this.groupService.createGroup(newUser);

    return newUser;
  }
}
