import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/helper/jwt/jwt.strategy';
import { UserDTO } from '../dto/user.dto';
import { CustomResponse } from 'src/helper/response/custom-response';
import { UserService } from '../services/user.service';

@Controller('users/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(@Body() userDto: UserDTO): Promise<CustomResponse<string>> {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    return this.userService.getUserProfile(userId);
  }

  @Post('/login')
  async login(@Body() userDto: UserDTO): Promise<CustomResponse<string>> {
    return this.userService.login(userDto);
  }
}
