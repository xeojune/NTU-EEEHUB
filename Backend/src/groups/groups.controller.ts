import { Controller, Post, Body, Param, Put, Get, ValidationPipe } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/createGroup.dto';
import { JoinGroupDto, RespondToJoinRequestDto, KickMemberDto, SetAdminDto } from './dtos/manageMember.dto';
import { Types } from 'mongoose';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAllGroups() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  async getGroupById(@Param('id') id: string) {
    return this.groupsService.findById(new Types.ObjectId(id));
  }

  @Post()
  async createGroup(
    @Body(new ValidationPipe()) createGroupDto: CreateGroupDto
  ) {
    return this.groupsService.createGroup(
      createGroupDto,
      new Types.ObjectId(createGroupDto.userId)
    );
  }

  @Post('join')
  async joinGroup(
    @Body(new ValidationPipe()) joinGroupDto: JoinGroupDto
  ) {
    return this.groupsService.joinGroup(
      { ...joinGroupDto, groupId: new Types.ObjectId(joinGroupDto.groupId) },
      new Types.ObjectId(joinGroupDto.userId)
    );
  }

  @Put('join/respond')
  async respondToJoinRequest(
    @Body(new ValidationPipe()) dto: RespondToJoinRequestDto
  ) {
    return this.groupsService.respondToJoinRequest(
      {
        ...dto,
        groupId: new Types.ObjectId(dto.groupId),
        userId: new Types.ObjectId(dto.userId)
      },
      new Types.ObjectId(dto.adminId)
    );
  }

  @Put('kick')
  async kickMember(
    @Body(new ValidationPipe()) kickMemberDto: KickMemberDto
  ) {
    return this.groupsService.kickMember(
      kickMemberDto,
      new Types.ObjectId(kickMemberDto.adminId)
    );
  }

  @Put('admin')
  async setAdmin(
    @Body(new ValidationPipe()) setAdminDto: SetAdminDto
  ) {
    return this.groupsService.setAdmin(
      setAdminDto,
      new Types.ObjectId(setAdminDto.creatorId)
    );
  }
}