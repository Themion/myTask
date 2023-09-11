import { CreateGroupDTO, PageInfo, createGroupDTOSchema, getPageInfoSchema } from '@my-task/common';
import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Email, ParsedBody } from '~/decorators';
import { JwtGuard } from '~/guard';
import { ZodParsePipe } from '~/pipe';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(JwtGuard)
  @Post()
  createGroup(@ParsedBody(createGroupDTOSchema) body: CreateGroupDTO, @Email() email: string) {
    return this.groupService.createGroupByEmail(email, body.name);
  }

  @UseGuards(JwtGuard)
  @Get()
  findGroup(
    @Email() email: string,
    @Query(new ZodParsePipe(getPageInfoSchema())) query: Partial<PageInfo> = {},
  ) {
    return this.groupService.findGroupByEmail(email, query);
  }

  @UseGuards(JwtGuard)
  @Get(':groupId')
  async findGroupById(@Email() email: string, @Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.findGroupById(groupId, email);
  }
}
