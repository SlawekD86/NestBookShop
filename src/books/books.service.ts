import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';
import { Prisma, Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public async getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({ include: { author: true } });
  }

  public async getById(id: string): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public async create(bookData: CreateBookDTO): Promise<Book> {
    try {
      return await this.prismaService.book.create({
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Title is already taken');
      } else if (error.code === 'P2025') {
        throw new BadRequestException('Invalid author ID');
      }
      throw error;
    }
  }

  public async updateById(id: string, bookData: UpdateBookDTO): Promise<void> {
    try {
      await this.prismaService.book.update({
        where: { id },
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Title is already taken');
      } else if (error.code === 'P2025') {
        throw new BadRequestException('Invalid author ID');
      }
      throw error;
    }
  }

  public async deleteById(id: string): Promise<void> {
    await this.prismaService.book.delete({
      where: { id },
    });
  }
}
