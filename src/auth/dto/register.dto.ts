import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "John Doe",
    description: "User full name",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: "john@example.com",
    description: "Unique email",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "password123",
    description: "Password in plain text (min 6 characters)",
    minLength: 6,
  })
  @MinLength(6)
  password!: string;
}
