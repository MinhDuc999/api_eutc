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
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Chấp nhận các loại file văn phòng
        const allowedMimeTypes = [
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/vnd.ms-excel', // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-powerpoint', // .ppt
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
          'application/pdf', // .pdf
          'text/plain', // .txt
          'application/vnd.oasis.opendocument.text', // .odt
          'application/vnd.oasis.opendocument.spreadsheet', // .ods
          'application/vnd.oasis.opendocument.presentation', // .odp
          'application/zip', // .zip
          'application/x-rar-compressed', // .rar
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          return callback(new Error('Chỉ chấp nhận file văn phòng!'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // Giới hạn 10MB
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
