import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uploadDir = configService.get<string>('UPLOAD_DIR') ?? 'uploads';
        const maxFileSize = configService.get<number>('MAX_FILE_SIZE') ?? 2097152;
        const booksUploadDir = join(process.cwd(), uploadDir, 'books');
        mkdirSync(booksUploadDir, { recursive: true });

        return {
          storage: diskStorage({
            destination: booksUploadDir,
            filename: (_request, file, callback) => {
              const extension = extname(file.originalname).toLowerCase();
              callback(null, `${randomUUID()}${extension}`);
            },
          }),
          limits: {
            fileSize: maxFileSize,
          },
          fileFilter: (_request, file, callback) => {
            if (!file.mimetype.startsWith('image/')) {
              return callback(new Error('Solo se permiten archivos de imagen'), false);
            }

            callback(null, true);
          },
        };
      },
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
