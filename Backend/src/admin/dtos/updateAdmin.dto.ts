import { IsEmail, IsOptional, IsString, MinLength, IsMongoId } from 'class-validator';

export class UpdateAdminDto {
    @IsMongoId()
    adminId: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsString({ each: true })
    permissions?: string[];
}