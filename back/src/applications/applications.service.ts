import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private readonly vacanciesService: VacanciesService,
    private readonly usersService: UsersService,
  ) { }

  async create(userId: string, vacancyId: string) {
    // check user exists
    try {
      await this.usersService.findOne(userId);
    } catch (e) {
      throw new NotFoundException('User not found');
    }

    // check vacancy exists and active
    const vacancy = await this.vacanciesService.findOne(vacancyId);
    if (!vacancy.isActive) throw new BadRequestException('Vacancy is not active');

    // check cupo (Dynamic check)
    const hasSlot = await this.vacanciesService.hasAvailableSlot(vacancyId);
    if (!hasSlot) {
      throw new BadRequestException('No slots available for this vacancy');
    }

    // check if already applied
    const existingApplication = await this.applicationsRepository.findOne({
      where: { user: { id: userId }, vacancy: { id: vacancyId } }
    });
    if (existingApplication) {
      throw new BadRequestException('User already applied to this vacancy');
    }

    // No need to increment applicants manually as we count dynamically

    const app = this.applicationsRepository.create({
      user: { id: userId },
      vacancy: { id: vacancyId },
      appliedAt: new Date(),
    });

    return this.applicationsRepository.save(app);
  }

  findAll() {
    return this.applicationsRepository.find({
      relations: ['user', 'vacancy']
    });
  }

  async findOne(id: string) {
    const app = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['user', 'vacancy']
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    // Applications usually aren't updated in this simple model, but implementing for completeness
    const app = await this.findOne(id);
    const updated = this.applicationsRepository.merge(app, updateApplicationDto as any);
    return this.applicationsRepository.save(updated);
  }

  async remove(id: string) {
    const app = await this.findOne(id);
    return this.applicationsRepository.remove(app);
  }
}
