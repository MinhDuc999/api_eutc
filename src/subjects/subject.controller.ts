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

  // Only Admin and Teacher can create subjects
  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async createSubject(@Body() subjectDto: SubjectDto) {
    return this.subjectService.createSubject(subjectDto);
  }

  // All authenticated users can view subjects
  @Get()
  async getAllSubjects() {
    return this.subjectService.getAllSubjects();
  }

  // All authenticated users can view subject details
  @Get(':id')
  async getSubjectById(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.getSubjectById(id);
  }

  // Only Admin and Teacher can update subjects
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() subjectDto: SubjectDto,
  ) {
    return this.subjectService.updateSubject(id, subjectDto);
  }

  // Only Admin can delete subjects
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN)
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.deleteSubject(id);
  }
}
