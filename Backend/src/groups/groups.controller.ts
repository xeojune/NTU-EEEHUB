import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ValidationPipe 
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/createGroup.dto';
import { JoinGroupDto, RespondToJoinRequestDto, KickMemberDto, SetAdminDto } from './dtos/manageMember.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAllGroups() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    return this.groupsService.getGroupWithSignedUrls(id);
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

  @Post(':id/icon')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIcon(
    @Param('id') groupId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.groupsService.uploadIcon(groupId, file);
  }

  @Post(':id/background')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBackgroundImage(
    @Param('id') groupId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.groupsService.uploadBackgroundImage(groupId, file);
  }
}