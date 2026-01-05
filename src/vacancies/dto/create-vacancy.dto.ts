import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayUnique,
  IsUUID,
} from 'class-validator';
import { Modality } from '../../common/enums/modality.enum';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Build awesome UIs' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'Senior', required: false })
  @IsOptional()
  @IsString()
  seniority?: string;

  @ApiProperty({ example: 'Communication, teamwork', required: false })
  @IsOptional()
  @IsString()
  softSkills?: string;

  @ApiProperty({ example: 'Remote', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ enum: Modality })
  @IsEnum(Modality)
  modality!: Modality;

  @ApiProperty({ example: '40k-60k', required: false })
  @IsOptional()
  @IsString()
  salaryRange?: string;

  @ApiProperty({ example: 'ACME Corp', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsInt()
  maxApplicants?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  technologies?: string[];
}
