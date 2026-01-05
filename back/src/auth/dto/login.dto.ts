import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class loginDto {
  @ApiProperty({ example: 'admin@example.com', description: 'User Email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'admin123', description: 'User Password' })
  @IsString()
  @MinLength(6)
  password!: string;
}
