import { createGroupDTOSchema } from '@my-task/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Email } from '~/decorators';
import { JwtGuard } from '~/guard';
import { MemberService } from '~/modules/member/member.service';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly memberService: MemberService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  createGroup(@Body() body: any, @Email() email: string) {
    const result = createGroupDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    return this.groupService.createGroupByEmail(email, data.name);
  }

  @UseGuards(JwtGuard)
  @Get()
  findGroup(@Email() email: string, @Query('page') offset: number = 1) {
    return this.groupService.findGroupByEmail(email, { offset });
  }

  @UseGuards(JwtGuard)
  @Get(':groupId')
  async findGroupById(@Email() email: string, @Param('groupId', ParseIntPipe) groupId: number) {
    const ifMember = await this.memberService.findIfUserIsMember(groupId, email);
    if (!ifMember)
      throw new UnauthorizedException(`User ${email} is not a member of Group #${groupId}`);
    return this.groupService.findGroupById(groupId);
  }
}
