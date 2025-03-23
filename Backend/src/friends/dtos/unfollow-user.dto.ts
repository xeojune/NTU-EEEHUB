import { IsNotEmpty, IsString } from 'class-validator';

export class UnfollowUserDto {
    @IsNotEmpty()
    @IsString()
    targetUserId: string;
}