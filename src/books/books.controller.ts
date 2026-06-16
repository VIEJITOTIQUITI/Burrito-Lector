import { Body, BadRequestException, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BooksService, UploadedBookImage } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll() {
    return {
      message: 'Catálogo de libros obtenido correctamente',
      data: await this.booksService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Libro obtenido correctamente',
      data: await this.booksService.findOne(id),
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() image?: UploadedBookImage,
  ) {
    return {
      message: 'Libro creado correctamente',
      data: await this.booksService.create(createBookDto, image),
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() image?: UploadedBookImage,
  ) {
    return {
      message: 'Libro actualizado correctamente',
      data: await this.booksService.update(id, updateBookDto, image),
    };
  }

  @Patch(':id/image')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image?: UploadedBookImage,
  ) {
    if (!image) {
      throw new BadRequestException('La imagen es obligatoria');
    }

    return {
      message: 'Portada actualizada correctamente',
      data: await this.booksService.updateImage(id, image),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Libro eliminado correctamente',
      data: await this.booksService.remove(id),
    };
  }
}
