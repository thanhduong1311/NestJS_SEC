import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartService } from './part.service';
import { PartController } from './part.controller';
import { Part } from 'src/entities/part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Part])],
  providers: [PartService],
  controllers: [PartController]
})
export class PartModule {}
