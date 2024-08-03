import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { Skill } from 'src/entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  providers: [SkillService],
  controllers: [SkillController]
})
export class SkillModule {}
