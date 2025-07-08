import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectDto } from './dto/subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountType } from '../accounts/dto/create-account.dto';

@Controller('subject')
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async createSubject(@Body() subjectDto: SubjectDto) {
    return this.subjectService.createSubject(subjectDto);
  }

  @Get()
  async getAllSubjects() {
    return this.subjectService.getAllSubjects();
  }

  @Get(':id')
  async getSubjectById(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.getSubjectById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() subjectDto: SubjectDto,
  ) {
    return this.subjectService.updateSubject(id, subjectDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN)
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.deleteSubject(id);
  }
}
