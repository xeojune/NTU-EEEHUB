import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './schemas/groups.schema';
import { CreateGroupDto } from './dtos/createGroup.dto';
import { JoinGroupDto, RespondToJoinRequestDto, KickMemberDto, SetAdminDto } from './dtos/manageMember.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findById(id: Types.ObjectId): Promise<Group> {
    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async createGroup(createGroupDto: CreateGroupDto, creatorId: Types.ObjectId): Promise<Group> {
    // Check for existing group with same handle
    const existingGroup = await this.groupModel.findOne({ 
      $or: [
        { handle: createGroupDto.handle.toLowerCase() },
        { name: createGroupDto.name }
      ]
    });
    
    if (existingGroup) {
      if (existingGroup.handle === createGroupDto.handle.toLowerCase()) {
        throw new ConflictException('A group with this handle already exists');
      }
      if (existingGroup.name === createGroupDto.name) {
        throw new ConflictException('A group with this name already exists');
      }
    }

    // Check if user has enough points
    try {
      await this.userService.getUserById(creatorId.toString());
      
      // Deduct points from creator
      await this.userService.updatePoints(creatorId.toString(), 1000);

      // Create the group with lowercase handle
      const group = new this.groupModel({
        ...createGroupDto,
        handle: createGroupDto.handle.toLowerCase(),
        creator: creatorId,
        admins: [creatorId],
        members: [creatorId],
        memberDetails: [{
          user: creatorId,
          role: 'admin',
          joinedAt: new Date()
        }]
      });

      return await group.save();
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException('Creator not found');
      }
      if (error.message === 'Insufficient points') {
        throw new BadRequestException('Insufficient points to create a group. Required: 1000 points');
      }
      if (error.code === 11000) {
        throw new ConflictException('A group with this handle or name already exists');
      }
      throw error;
    }
  }

  async joinGroup(joinGroupDto: JoinGroupDto, userId: Types.ObjectId): Promise<void> {
    const group = await this.groupModel.findById(joinGroupDto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Check if user exists
    try {
      await this.userService.getUserById(userId.toString());
    } catch (error) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member or has a pending request
    const isMember = group.members.some(
      memberId => memberId.toString() === userId.toString()
    );
    
    const hasPendingRequest = group.memberDetails.some(
      detail => detail.user.toString() === userId.toString() && detail.role === 'pending'
    );

    if (isMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    if (hasPendingRequest) {
      throw new BadRequestException('User already has a pending join request');
    }

    // Add to pending members
    await this.groupModel.updateOne(
      { _id: joinGroupDto.groupId },
      {
        $push: {
          memberDetails: {
            user: userId,
            role: 'pending',
            joinedAt: new Date(),
            message: joinGroupDto.message || ''
          }
        }
      }
    );
  }

  async respondToJoinRequest(dto: RespondToJoinRequestDto, adminId: Types.ObjectId): Promise<void> {
    const group = await this.groupModel.findById(dto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Verify admin permissions
    const isAdmin = group.admins.some(id => id.toString() === adminId.toString());
    const isCreator = group.creator.toString() === adminId.toString();
    
    if (!isAdmin && !isCreator) {
      throw new ForbiddenException('Only admins can respond to join requests');
    }

    // Find the pending request
    const pendingRequest = group.memberDetails.find(
      detail => detail.user.toString() === dto.userId.toString() && detail.role === 'pending'
    );

    if (!pendingRequest) {
      throw new NotFoundException('Join request not found');
    }

    if (dto.action === 'accept') {
      // Add user to members and update member details
      await this.groupModel.updateOne(
        { _id: dto.groupId },
        {
          $addToSet: { members: dto.userId },
          $set: {
            'memberDetails.$[elem].role': 'member',
            'memberDetails.$[elem].message': dto.message || pendingRequest.message
          }
        },
        {
          arrayFilters: [{ 'elem.user': dto.userId, 'elem.role': 'pending' }]
        }
      );
    } else {
      // Remove the pending request
      await this.groupModel.updateOne(
        { _id: dto.groupId },
        {
          $pull: {
            memberDetails: {
              user: dto.userId,
              role: 'pending'
            }
          }
        }
      );
    }
  }

  async kickMember(dto: KickMemberDto, adminId: Types.ObjectId): Promise<void> {
    const group = await this.groupModel.findById(dto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Verify admin permissions
    if (!group.admins.includes(adminId)) {
      throw new ForbiddenException('Only admins can kick members');
    }

    // Cannot kick the creator
    if (group.creator.toString() === dto.userId.toString()) {
      throw new ForbiddenException('Cannot kick the group creator');
    }

    // Remove user from members and member details
    await this.groupModel.updateOne(
      { _id: dto.groupId },
      {
        $pull: {
          members: dto.userId,
          admins: dto.userId,
          memberDetails: { user: dto.userId }
        }
      }
    );

    // TODO: Notify kicked user
  }

  async setAdmin(dto: SetAdminDto, creatorId: Types.ObjectId): Promise<void> {
    const group = await this.groupModel.findById(dto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Only creator can manage admins
    if (group.creator.toString() !== creatorId.toString()) {
      throw new ForbiddenException('Only the group creator can manage admins');
    }

    // Check if user is a member
    if (!group.members.includes(dto.userId)) {
      throw new BadRequestException('User must be a member to be set as admin');
    }

    if (dto.action === 'add') {
      // Add user to admins if not already an admin
      if (!group.admins.includes(dto.userId)) {
        await this.groupModel.updateOne(
          { _id: dto.groupId },
          {
            $push: { admins: dto.userId },
            $set: { 'memberDetails.$[elem].role': 'admin' }
          },
          {
            arrayFilters: [{ 'elem.user': dto.userId }]
          }
        );
      }
    } else {
      // Remove user from admins but keep as member
      await this.groupModel.updateOne(
        { _id: dto.groupId },
        {
          $pull: { admins: dto.userId },
          $set: { 'memberDetails.$[elem].role': 'member' }
        },
        {
          arrayFilters: [{ 'elem.user': dto.userId }]
          }
      );
    }

    // TODO: Notify user about admin status change
  }
}