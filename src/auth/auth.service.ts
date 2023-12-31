import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async register(registrationData: RegisterDTO) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const userData = {
      email: registrationData.email,
    };
    return this.usersService.create(userData, hashedPassword);
  }
}
