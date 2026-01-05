import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { v4 as uuidv4 } from 'uuid';
import { VacanciesService } from '../vacancies/vacancies.service';
import { UsersService } from '../users/users.service';

interface ApplicationRecord {
  id: string;
  userId: string;
  vacancyId: string;
  appliedAt: Date;
}

@Injectable()
export class ApplicationsService {
  private applications: ApplicationRecord[] = [];

  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly usersService: UsersService,
  ) {}

  create(userId: string, vacancyId: string) {
    // check user exists
    try {
      this.usersService.findOne(userId);
    } catch (e) {
      throw new NotFoundException('User not found');
    }

    // check vacancy exists and active
    const vacancy = this.vacanciesService.findOne(vacancyId);
    if (!vacancy.isActive) throw new BadRequestException('Vacancy is not active');

    // check cupo
    if (!this.vacanciesService.hasAvailableSlot(vacancyId)) {
      throw new BadRequestException('No slots available for this vacancy');
    }

    // increment applicants
    this.vacanciesService.incrementApplicants(vacancyId);

    const app: ApplicationRecord = {
      id: uuidv4(),
      userId,
      vacancyId,
      appliedAt: new Date(),
    } as ApplicationRecord;

    this.applications.push(app);
    return { ...app };
  }

  findAll() {
    return this.applications.map((a) => ({ ...a }));
  }

  findOne(id: string) {
    const app = this.applications.find((a) => a.id === id);
    if (!app) throw new NotFoundException('Application not found');
    return { ...app };
  }

  update(id: string, updateApplicationDto: UpdateApplicationDto) {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException('Application not found');
    this.applications[idx] = { ...this.applications[idx], ...updateApplicationDto } as ApplicationRecord;
    return { ...this.applications[idx] };
  }

  remove(id: string) {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new NotFoundException('Application not found');
    const removed = this.applications.splice(idx, 1)[0];
    return { ...removed };
  }
}
