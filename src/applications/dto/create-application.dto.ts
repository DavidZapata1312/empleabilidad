import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ description: 'Vacancy id', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  vacancyId!: string;
}
