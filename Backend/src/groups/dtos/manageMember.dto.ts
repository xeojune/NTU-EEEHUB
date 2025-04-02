import { IsString, IsMongoId, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class JoinGroupDto {
  @IsMongoId()
  groupId: Types.ObjectId;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  userId: string;
}

export class RespondToJoinRequestDto {
  @IsMongoId()
  groupId: Types.ObjectId;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsString()
  adminId: string;

  @IsEnum(['accept', 'reject'])
  action: 'accept' | 'reject';

  @IsString()
  @IsOptional()
  message?: string;
}

export class KickMemberDto {
  @IsMongoId()
  groupId: Types.ObjectId;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsString()
  adminId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class SetAdminDto {
  @IsMongoId()
  groupId: Types.ObjectId;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsString()
  creatorId: string;

  @IsEnum(['add', 'remove'])
  action: 'add' | 'remove';
}

// For tracking pending join requests
export class PendingMemberDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsString()
  status: 'pending' | 'accepted' | 'rejected';

  @IsString()
  @IsOptional()
  message?: string;

  createdAt: Date;
}