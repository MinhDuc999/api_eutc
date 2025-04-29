import { IsString, IsNumber, IsOptional } from 'class-validator';

export class SubjectDto {
  @IsOptional()
  @IsString()
  subjectName?: string;

  @IsOptional()
  @IsString()
  subjectCategory?: string;

  @IsOptional()
  @IsNumber()
  numberCredit?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  totalNumber?: number;
}
