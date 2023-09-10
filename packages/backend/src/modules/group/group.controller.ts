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
  UseGuards,
} from '@nestjs/common';
import { Email } from '~/decorators';
import { JwtGuard } from '~/guard';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

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
  async findGroupById(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.findGroupById(groupId);
  }
}
