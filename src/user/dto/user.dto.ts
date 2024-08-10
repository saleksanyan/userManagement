import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  mail: string;
}
