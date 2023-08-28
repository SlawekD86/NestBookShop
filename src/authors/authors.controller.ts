import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, ConflictException } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDTO } from './dto/create-author.dto';
import { UpdateAuthorDTO } from './dto/update-author.dto';
import { Author } from '@prisma/client';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get()
  async getAll(): Promise<Author[]> {
    return this.authorsService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Author | null> {
    const author = await this.authorsService.getById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  @Post()
  async create(@Body() authorData: CreateAuthorDTO): Promise<Author> {
    return this.authorsService.create(authorData);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() authorData: UpdateAuthorDTO): Promise<{ success: boolean }> {
    const author = await this.authorsService.getById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    await this.authorsService.updateById(id, authorData);
    return { success: true };
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string): Promise<{ success: boolean }> {
    const author = await this.authorsService.getById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    await this.authorsService.deleteById(id);
    return { success: true };
  }
}
