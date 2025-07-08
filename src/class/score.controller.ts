import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { ClassScoreDto } from './dto/score.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountType } from '../accounts/dto/create-account.dto';

@Controller('classes/:classId/score')
@UseGuards(JwtAuthGuard)
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Get()
  async getScoresByClassId(@Param('classId', ParseIntPipe) classId: number) {
    return this.scoreService.getScoresByClassId(classId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async saveClassScores(
    @Param('classId', ParseIntPipe) classId: number,
    @Body() classScoreDto: ClassScoreDto,
  ) {
    classScoreDto.classId = classId;
    return this.scoreService.saveClassScores(classScoreDto);
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateClassScores(
    @Param('classId', ParseIntPipe) classId: number,
    @Body() classScoreDto: ClassScoreDto,
  ) {
    classScoreDto.classId = classId;
    return this.scoreService.saveClassScores(classScoreDto);
  }
}
