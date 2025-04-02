import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class GroupSettingsDto {
  @IsOptional()
  allowMemberPosts?: boolean;

  @IsOptional()
  allowMemberEvents?: boolean;

  @IsOptional()
  allowMemberFiles?: boolean;

  @IsOptional()
  requireAdminApproval?: boolean;
}

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  handle: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(['public', 'private', 'restricted'])
  @IsOptional()
  privacy?: 'public' | 'private' | 'restricted' = 'public';

  @IsOptional()
  settings?: GroupSettingsDto;

  @IsOptional()
  image?: string;

  @IsOptional()
  banner?: string;
}