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

  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async createClass(@Body() classDto: ClassDto) {
    return this.classService.createClass(classDto);
  }

  @Get()
  async getAllClasses() {
    return this.classService.getAllClasses();
  }

  @Get(':id')
  async getClassById(@Param('id', ParseIntPipe) id: number) {
    return this.classService.getClassById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateClass(
    @Param('id', ParseIntPipe) id: number,
    @Body() classDto: ClassDto,
  ) {
    return this.classService.updateClass(id, classDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN)
  async deleteClass(@Param('id', ParseIntPipe) id: number) {
    return this.classService.deleteClass(id);
  }
}
