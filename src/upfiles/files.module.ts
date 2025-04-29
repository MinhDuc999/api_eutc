import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UpfilesController } from './files.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './upfiles',
    }),
  ],
  controllers: [UpfilesController],
})
export class UpfilesModule {}
