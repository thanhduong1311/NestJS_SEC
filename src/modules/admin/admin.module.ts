import { Module } from '@nestjs/common';
import { Admin } from '../../entities/admin.entity';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Role])],
  controllers: [],
  providers: [AdminService]
})
export class AdminModule {}
