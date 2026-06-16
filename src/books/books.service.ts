import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

export interface UploadedBookImage {
  filename: string;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private readonly configService: ConfigService,
  ) {}

  create(createBookDto: CreateBookDto, image?: UploadedBookImage): Promise<Book> {
    const book = this.booksRepository.create({
      ...createBookDto,
      imageUrl: image ? this.buildImageUrl(image.filename) : createBookDto.imageUrl,
    });

    return this.booksRepository.save(book).catch((error: unknown) => {
      if (image) {
        this.removeLocalImage(this.buildImageUrl(image.filename));
      }

      throw error;
    });
  }

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }

    return book;
  }

  async update(
    id: number,
    updateBookDto: UpdateBookDto,
    image?: UploadedBookImage,
  ): Promise<Book> {
    const book = await this.findOne(id);
    const previousImageUrl = book.imageUrl;

    const updatedBook = this.booksRepository.merge(book, updateBookDto);
    if (image) {
      updatedBook.imageUrl = this.buildImageUrl(image.filename);
    }

    return this.booksRepository
      .save(updatedBook)
      .then((savedBook) => {
        if (image && previousImageUrl) {
          this.removeLocalImage(previousImageUrl);
        }

        return savedBook;
      })
      .catch((error: unknown) => {
        if (image) {
          this.removeLocalImage(this.buildImageUrl(image.filename));
        }

        throw error;
      });
  }

  updateImage(id: number, image: UploadedBookImage): Promise<Book> {
    return this.update(id, {}, image);
  }

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
    if (book.imageUrl) {
      this.removeLocalImage(book.imageUrl);
    }

    return book;
  }

  private buildImageUrl(filename: string): string {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR') ?? 'uploads';
    return `/${uploadDir}/books/${filename}`;
  }

  private removeLocalImage(imageUrl: string): void {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR') ?? 'uploads';
    const publicPrefix = `/${uploadDir}/books/`;
    if (!imageUrl.startsWith(publicPrefix)) {
      return;
    }

    const filename = imageUrl.slice(publicPrefix.length);
    const filePath = join(process.cwd(), uploadDir, 'books', filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
