



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologiesService } from './technologies.service';
import { TechnologiesController } from './technologies.controller';
import { Technology } from './entities/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
  exports: [TechnologiesService] // good practice
})
export class TechnologiesModule { }
