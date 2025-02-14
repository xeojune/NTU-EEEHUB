import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id') // Accept the ID in the URL
  async getUserById(@Param('id') id: string) {
    console.log('Fetching user with ID:', id); // Debug log
    return this.userService.getUserById(id);
  }

  //get profile information
  @Get(':id/profile')
  async getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  //upload profile image
  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.userService.uploadProfileImage(id, file);
  }

  @Post(':id/background-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadBackgroundImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.userService.uploadBackgroundImage(id, file);
  }

  @Get(':id/points')
  async getUserPoints(@Param('id') id: string) {
    const profile = await this.userService.getUserProfile(id);
    return { points: profile.totalPoints};
  }



}
