import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, LoginAdminDto } from './dtos/admin.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  async registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    this.logger.log(`Attempting to register admin with email: ${createAdminDto.email}`);
    try {
      const result = await this.adminService.registerAdmin(createAdminDto);
      this.logger.log(`Successfully registered admin with email: ${createAdminDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to register admin: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('login')
  async loginAdmin(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.loginAdmin(loginAdminDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard, AdminGuard)
  async getAdminProfile(@Body() adminId: string) {
    return this.adminService.getAdminProfile(adminId);
  }

  @Put('update')
  @UseGuards(AuthGuard, AdminGuard)
  async updateAdminProfile(@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdminProfile(updateAdminDto);
  }

  @Get('users')
  @UseGuards(AuthGuard, AdminGuard)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('posts')
  @UseGuards(AuthGuard, AdminGuard)
  async getAllPosts() {
    return this.adminService.getAllPosts();
  }

  @Delete('users/:id')
  @UseGuards(AuthGuard, AdminGuard)
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Delete('posts/:id')
  @UseGuards(AuthGuard, AdminGuard)
  async deletePost(@Param('id') postId: string) {
    return this.adminService.deletePost(postId);
  }

  @Get('users/:userId/growth')
  @UseGuards(AuthGuard, AdminGuard)
  async getUserGrowthData(@Param('userId') userId: string) {
    return this.adminService.getUserGrowthData(userId);
  }
}