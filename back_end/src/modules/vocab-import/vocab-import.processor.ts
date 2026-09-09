import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as ExcelJS from 'exceljs';
import { PrismaService } from '../../Prisma/prisma.service.js';
import { NotifiCationService } from '../notifications/notification.service.js';

export interface ImportExcelJobData {
  fileBase64: string;
  categoryId: number;
  userId: string;
  fileName: string;
}

@Processor('excel-import-queue')
export class VocabImportProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotifiCationService,
  ) {
    super();
  }

  async process(job: Job<ImportExcelJobData>): Promise<any> {
    const { fileBase64, categoryId, userId, fileName } = job.data;

    try {
      const buffer = Buffer.from(fileBase64, 'base64');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);

      const worksheet = workbook.getWorksheet(1); 
      if (!worksheet || worksheet.rowCount <= 1) {
        throw new Error('File Excel rỗng hoặc không chứa dữ liệu từ vựng');
      }

      // xử lý những cell không phải là string
      const extractCellString = (cell: ExcelJS.Cell): string => {
        if (!cell || cell.value === null || cell.value === undefined) return '';
        if (typeof cell.value === 'object') {
          if ('result' in cell.value && cell.value.result !== undefined) {
            return String(cell.value.result).trim();
          }
          if ('text' in cell.value && cell.value.text !== undefined) {
            return String(cell.value.text).trim();
          }
        }
        return cell.text ? cell.text.trim() : String(cell.value).trim();
      };

      
      let wordColIndex = -1;
      let meanColIndex = -1;
      let exampleColIndex = -1;

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        const headerText = extractCellString(cell).toLowerCase();

        if (['word', 'từ vựng', 'tu vung', 'từ', 'tu', 'vocabulary', 'Vocabulary'].includes(headerText)) {
          wordColIndex = colNumber;
        } else if (['mean', 'meaning', 'nghĩa', 'nghia', 'dịch', 'dich', 'definition', 'means'].includes(headerText)) {
          meanColIndex = colNumber;
        } else if (['example', 'ví dụ', 'vi du', 'câu ví dụ', 'cau vi du', 'sentence'].includes(headerText)) {
          exampleColIndex = colNumber;
        }
      });

     
      if (wordColIndex === -1 || meanColIndex === -1) {
        throw new Error(
          'File Excel thiếu cột tiêu đề bắt buộc. Vui lòng đảm bảo có cột "Từ vựng" và cột "Nghĩa".',
        );
      }

      const vocabList: Array<{ categoryId: number; word: string; mean: string; example?: string | null }> = [];

     
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; 

        const word = extractCellString(row.getCell(wordColIndex));
        const mean = extractCellString(row.getCell(meanColIndex));
        const example = exampleColIndex !== -1 ? extractCellString(row.getCell(exampleColIndex)) : null;

        
        if (word && mean) {
          vocabList.push({
            categoryId: Number(categoryId),
            word,
            mean,
            example: example || null,
          });
        }
      });

      if (vocabList.length === 0) {
        throw new Error('Không tìm thấy dòng từ vựng hợp lệ nào trong file Excel');
      }

      const CHUNK_SIZE = 500;
      let insertedCount = 0;

      for (let i = 0; i < vocabList.length; i += CHUNK_SIZE) {
        const chunk = vocabList.slice(i, i + CHUNK_SIZE);
        await this.prisma.vocabulary.createMany({
          data: chunk,
        });
        insertedCount += chunk.length;

        // Tạm nghỉ 1ms cho Event Loop 
        await new Promise((resolve) => setImmediate(resolve));
      }

      // Bắn thông báo SSE về cho client
      await this.notificationService.pushNotification(
        userId,
        'Import từ vựng thành công',
        `Đã nhập thành công ${insertedCount} từ vựng từ file "${fileName}".`,
      );

      return { totalInserted: insertedCount };
    } catch (error: any) {
      
      await this.notificationService.pushNotification(
        userId,
        'Import từ vựng thất bại',
        `Lỗi khi xử lý file "${fileName}": ${error.message}`,
      );
      throw error;
    }
  }
}
