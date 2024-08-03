import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Test } from 'src/entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  providers: [TestService],
  controllers: [TestController]
})
export class TestModule {}
