import { Body, Controller, Delete, Get, Post, ValidationPipe, HttpException, HttpStatus, Query, Logger } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { FollowUserDto } from "./dtos/follow-user.dto";
import { UnfollowUserDto } from "./dtos/unfollow-user.dto";

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @Post('follow')
    async followUser(@Body(new ValidationPipe()) followDto: FollowUserDto) {
        Logger.log('Received follow request:', followDto);
        try {
            const result = await this.friendsService.followUser(followDto);
            Logger.log('Follow request successful:', result);
            return {
                success: true,
                message: result.message
            };
        } catch (error) {
            Logger.error('Follow user error:', {
                error: error.message,
                stack: error.stack,
                dto: followDto
            });
            throw new HttpException(
                error.message || 'Failed to follow user',
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete('unfollow')
    async unfollowUser(
        @Query('userId') userId: string,
        @Body(new ValidationPipe()) unfollowUserDto: UnfollowUserDto
    ) {
        try {
            const result = await this.friendsService.unfollowUser(userId, unfollowUserDto);
            return {
                success: true,
                data: result,
                message: 'Successfully unfollowed user'
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to unfollow user',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('followers')
    async getFollowers(
        @Query('userId') userId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        try {
            const followers = await this.friendsService.getFollowers(userId, parseInt(page), parseInt(limit));
            return {
                success: true,
                data: followers,
                message: 'Successfully retrieved followers'
            };
        } catch (error) {
            Logger.error('Followers error:', error);
            throw new HttpException(
                error.message || 'Failed to get followers',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('followings')
    async getFollowings(
        @Query('userId') userId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        try {
            const followings = await this.friendsService.getFollowings(userId, parseInt(page), parseInt(limit));
            return {
                success: true,
                data: followings,
                message: 'Successfully retrieved followings'
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to get followings',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('users')
    async getAllUsers(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('currentUserId') currentUserId?: string
    ) {
        try {
            const result = await this.friendsService.getAllUsers(
                parseInt(page),
                parseInt(limit),
                currentUserId
            );
            return {
                success: true,
                data: result,
                message: 'Successfully retrieved users'
            };
        } catch (error) {
            Logger.error('Get all users error:', error);
            throw new HttpException(
                error.message || 'Failed to get users',
                error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
