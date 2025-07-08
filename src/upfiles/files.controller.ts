import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('upfiles')
export class UpfilesController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upfiles',
        filename: (req, file, callback) => {
          const originalName = file.originalname.replace(
            extname(file.originalname),
            '',
          );
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${originalName}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/pdf',
          'text/plain',
          'application/vnd.oasis.opendocument.text',
          'application/vnd.oasis.opendocument.spreadsheet',
          'application/vnd.oasis.opendocument.presentation',
          'application/zip',
          'application/x-rar-compressed',
          'application/octet-stream',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          return callback(new Error('Chỉ chấp nhận file văn phòng!'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 50,
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        status: false,
        message: 'Không có file nào được upload',
      };
    }

    return {
      status: true,
      message: 'Upload thành công',
      data: {
        originalname: file.originalname,
        filename: file.filename,
        path: `upfiles/${file.filename}`,
        url: `http://localhost:3000/upfiles/${file.filename}`,
      },
    };
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './upfiles' });
  }
}
