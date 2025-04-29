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
import { ClassService } from './class.service';
import { ClassDto } from './dto/class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountType } from '../accounts/dto/create-account.dto';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassController {
  constructor(private classService: ClassService) {}

  // Only Admin and Teacher can create classes
  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async createClass(@Body() classDto: ClassDto) {
    return this.classService.createClass(classDto);
  }

  // All authenticated users can view classes
  @Get()
  async getAllClasses() {
    return this.classService.getAllClasses();
  }

  // All authenticated users can view class details
  @Get(':id')
  async getClassById(@Param('id', ParseIntPipe) id: number) {
    return this.classService.getClassById(id);
  }

  // Only Admin and Teacher can update classes
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateClass(
    @Param('id', ParseIntPipe) id: number,
    @Body() classDto: ClassDto,
  ) {
    return this.classService.updateClass(id, classDto);
  }

  // Only Admin can delete classes
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN)
  async deleteClass(@Param('id', ParseIntPipe) id: number) {
    return this.classService.deleteClass(id);
  }
}
