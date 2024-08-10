import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../dto/user.dto';
import { CustomResponse } from 'src/helper/response/custom-response';
import {
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
} from 'src/helper/response/response-message';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(userDto: UserDTO): Promise<CustomResponse<string>> {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let user: User;
      if (!userDto.username || !userDto.mail || !userDto.password) {
        throw new BadRequestException({
          message: 'Invalid input',
        });
      }
      user = queryRunner.manager.getRepository(User).create({
        username: userDto.username,
        password: userDto.password,
        mail: userDto.mail,
      });

      await queryRunner.manager.getRepository(User).save(user);

      const accessToken = this.jwtService.sign({ userId: user.id });

      await queryRunner.commitTransaction();

      return new CustomResponse<string>(
        SUCCESS_MESSAGE,
        accessToken,
        null,
        null,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new CustomResponse<string>(
        ERROR_MESSAGE,
        null,
        error.message,
        'Failed to register',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async login(userDto: UserDTO): Promise<CustomResponse<string>> {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if(!userDto.mail || !userDto.password) {
        throw new BadRequestException({
          statusCode: 403,
          message: 'Invalid input',
        });
      }
      const user = await queryRunner.manager.getRepository(User).findOne({
        where: {
          mail: userDto.mail,
          password: userDto.password,
        },
      });
      if (!user)
        throw new BadRequestException({
          statusCode: 403,
          message: 'User not found',
        });
      const accessToken = this.jwtService.sign({ userId: user.id });

      await queryRunner.commitTransaction();

      return new CustomResponse<string>(
        SUCCESS_MESSAGE,
        accessToken,
        null,
        null,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new CustomResponse<string>(
        ERROR_MESSAGE,
        null,
        error.message,
        'Failed to login',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string): Promise<User> {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.getRepository(User).findOne({
        where: { id: id },
      });
      await queryRunner.commitTransaction();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user: User = await this.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }
      await queryRunner.commitTransaction();
      const userInfo = {
        email: user.mail,
        username: user.username,
      };
      return new CustomResponse<any>(SUCCESS_MESSAGE, userInfo, null, null);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new CustomResponse<string>(
        ERROR_MESSAGE,
        null,
        error.message,
        'Failed to get user profile',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
