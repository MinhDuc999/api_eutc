import {
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TeacherDto {
  @IsString()
  codeID: string;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;
}

export class StudentDto {
  @IsString()
  codeID: string;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;
}

export class FileDto {
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

export class ClassDto {
  @IsOptional()
  @IsString()
  className?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsObject()
  @Type(() => TeacherDto)
  teacher?: TeacherDto;

  @IsOptional()
  @IsArray()
  @Type(() => StudentDto)
  students?: StudentDto[];

  @IsOptional()
  @IsArray()
  @Type(() => FileDto)
  files?: FileDto[];
}
