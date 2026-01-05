import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [VacanciesModule, UsersModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
