import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StudentScoreDto {
  @IsString()
  studentId: string;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsNumber()
  qt?: number;

  @IsOptional()
  @IsNumber()
  th?: number;

  @IsOptional()
  @IsNumber()
  tk?: number;

  @IsOptional()
  @IsString()
  tt?: string;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class ClassScoreDto {
  @IsNumber()
  classId: number;

  @IsString()
  className: string;

  @IsArray()
  @Type(() => StudentScoreDto)
  score: StudentScoreDto[];
}
