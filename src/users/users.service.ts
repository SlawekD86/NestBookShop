import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(userData: Prisma.UserCreateInput, hashedPassword: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...userData,
        password: { create: { hashedPassword } },
      },
    });
  }
}
