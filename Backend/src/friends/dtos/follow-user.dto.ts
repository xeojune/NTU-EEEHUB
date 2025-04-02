import { IsNotEmpty, IsString } from 'class-validator';

export class FollowUserDto {
    @IsNotEmpty()
    @IsString()
    followerId: string;

    @IsNotEmpty()
    @IsString()
    followingId: string;
}