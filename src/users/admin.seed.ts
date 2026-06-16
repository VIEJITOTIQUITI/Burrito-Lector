import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';

@Injectable()
export class AdminSeed implements OnModuleInit {
  private readonly logger = new Logger(AdminSeed.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit(): Promise<void> {
    const name = this.configService.get<string>('ADMIN_NAME');
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');

    if (!name || !email || !password) {
      return;
    }

    const existingAdmin = await this.usersService.findByEmail(email);
    if (existingAdmin) {
      return;
    }

    await this.usersService.create({ name, email, password, role: Role.ADMIN });
    this.logger.log('Initial admin user created from environment variables');
  }
}
