import { UsersService } from './users.service';
import { Controller, Get } from '@nestjs/common';




@Controller('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('Users')
  async getAllUsers() {
    return this.userService.GetAllUsers();
  }
}
