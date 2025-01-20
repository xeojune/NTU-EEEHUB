import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id') // Accept the ID in the URL
  async getUserById(@Param('id') id: string) {
    console.log('Fetching user with ID:', id); // Debug log
    return this.userService.getUserById(id);
  }
}
