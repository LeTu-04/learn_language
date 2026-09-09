import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { Request } from 'express';

@Controller('Category')
export class VocabImportController {
  constructor(
    @InjectQueue('excel-import-queue')
    private readonly importQueue: Queue,
  ) {}

  @Post(':CategoryId/vocabularies/import-excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @Param('CategoryId', ParseIntPipe) categoryId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!req.user?.sub) {
      throw new UnauthorizedException('Không tìm thấy thông tin đăng nhập');
    }

    if (!file) {
      throw new BadRequestException('Vui lòng chọn file Excel để upload');
    }

    // Mã hóa file Buffer thành chuỗi Base64 và đưa vào Redis Queue
    const job = await this.importQueue.add(
      'process-excel-job',
      {
        fileBase64: file.buffer.toString('base64'),
        categoryId,
        userId: req.user.sub,
        fileName: file.originalname,
      },
      {
        attempts: 2,
        removeOnComplete: true,
      },
    );

    return {
      message: 'File đã được tiếp nhận thành công và đang được xử lý.',
      jobId: job.id,
      STATUS_CODES: 202,
    };
  }
}
