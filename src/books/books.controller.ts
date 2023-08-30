import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';
import { Prisma, Book } from '@prisma/client';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  async getAll(): Promise<Book[]> {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Book | null> {
    const book = await this.booksService.getById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  @Post()
  async create(@Body() bookData: CreateBookDTO): Promise<Book> {
    return this.booksService.create(bookData);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() bookData: UpdateBookDTO): Promise<void> {
    if (!(await this.booksService.getById(id))) {
      throw new NotFoundException('Book not found');
    }
    await this.booksService.updateById(id, bookData);
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string): Promise<void> {
    if (!(await this.booksService.getById(id))) {
      throw new NotFoundException('Book not found');
    }
    await this.booksService.deleteById(id);
  }
}
