import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateAuthorDTO } from './dto/create-author.dto';
import { UpdateAuthorDTO } from './dto/update-author.dto';
import { Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) {}

  public async getAll(): Promise<Author[]> {
    return this.prismaService.author.findMany();
  }

  public async getById(id: string): Promise<Author | null> {
    return this.prismaService.author.findUnique({
      where: { id },
    });
  }

  public async create(authorData: CreateAuthorDTO): Promise<Author> {
    try {
      return await this.prismaService.author.create({
        data: authorData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name is already taken');
      }
      throw error;
    }
  }

  public async updateById(id: string, authorData: UpdateAuthorDTO): Promise<Author> {
    try {
      return await this.prismaService.author.update({
        where: { id },
        data: authorData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name is already taken');
      }
      throw error;
    }
  }

  public async deleteById(id: string): Promise<Author> {
    const author = await this.getById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return this.prismaService.author.delete({
      where: { id },
    });
  }
}
