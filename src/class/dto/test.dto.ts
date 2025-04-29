import {
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TestFileDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsDate()
  uploadedAt?: Date;
}

export class SubmissionDto {
  @IsOptional()
  @IsString()
  studentName?: string;

  @IsOptional()
  @IsString()
  studentCode?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsDate()
  submittedAt?: Date;
}

export class TestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  classId?: number;

  @IsOptional()
  @IsString()
  className?: string;

  @IsOptional()
  @IsObject()
  @Type(() => TestFileDto)
  files?: TestFileDto;

  @IsOptional()
  @IsArray()
  @Type(() => SubmissionDto)
  submissions?: SubmissionDto[];
}
