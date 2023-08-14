import { createGroupDTOSchema } from '@my-task/common';
import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
