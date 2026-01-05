import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { v4 as uuidv4 } from 'uuid';
import { Modality } from '../common/enums/modality.enum';

interface VacancyRecord extends CreateVacancyDto {
  id: string;
  createdAt: Date;
  isActive: boolean;
  applicantsCount: number;
}

@Injectable()
export class VacanciesService {
  private vacancies: VacancyRecord[] = [];

  create(createVacancyDto: CreateVacancyDto) {
    const vacancy: VacancyRecord = {
      id: uuidv4(),
      title: createVacancyDto.title,
      description: createVacancyDto.description,
      seniority: createVacancyDto.seniority,
      softSkills: createVacancyDto.softSkills,
      location: createVacancyDto.location,
      modality: createVacancyDto.modality as Modality,
      salaryRange: createVacancyDto.salaryRange,
      company: createVacancyDto.company,
      maxApplicants: createVacancyDto.maxApplicants ?? null,
      technologies: createVacancyDto.technologies ?? [],
      createdAt: new Date(),
      isActive: true,
      applicantsCount: 0,
    } as VacancyRecord;

    this.vacancies.push(vacancy);
    return { ...vacancy };
  }

  findAll(filters?: Partial<VacancyRecord>) {
    // Simple filter implementation based on provided fields
    if (!filters) return this.vacancies.map((v) => ({ ...v }));
    return this.vacancies
      .filter((v) => {
        if (filters.title && !v.title.includes(filters.title)) return false;
        if (filters.seniority && v.seniority !== filters.seniority) return false;
        if (filters.location && v.location !== filters.location) return false;
        if (filters.modality && v.modality !== filters.modality) return false;
        if (filters.company && v.company !== filters.company) return false;
        return true;
      })
      .map((v) => ({ ...v }));
  }

  findOne(id: string) {
    const vacancy = this.vacancies.find((v) => v.id === id);
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return { ...vacancy };
  }

  update(id: string, updateVacancyDto: UpdateVacancyDto) {
    const idx = this.vacancies.findIndex((v) => v.id === id);
    if (idx === -1) throw new NotFoundException('Vacancy not found');
    this.vacancies[idx] = { ...this.vacancies[idx], ...updateVacancyDto } as VacancyRecord;
    return { ...this.vacancies[idx] };
  }

  remove(id: string) {
    const idx = this.vacancies.findIndex((v) => v.id === id);
    if (idx === -1) throw new NotFoundException('Vacancy not found');
    const removed = this.vacancies.splice(idx, 1)[0];
    return { ...removed };
  }

  // helper: check cupo available
  hasAvailableSlot(id: string) {
    const vacancy = this.vacancies.find((v) => v.id === id);
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    if (vacancy.maxApplicants == null) return true; // unlimited
    return vacancy.applicantsCount < vacancy.maxApplicants;
  }

  incrementApplicants(id: string) {
    const vacancy = this.vacancies.find((v) => v.id === id);
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    if (vacancy.maxApplicants != null && vacancy.applicantsCount >= vacancy.maxApplicants) {
      throw new BadRequestException('No slots available');
    }
    vacancy.applicantsCount += 1;
    return { ...vacancy };
  }

  setActive(id: string, active: boolean) {
    const idx = this.vacancies.findIndex((v) => v.id === id);
    if (idx === -1) throw new NotFoundException('Vacancy not found');
    this.vacancies[idx].isActive = active;
    return { ...this.vacancies[idx] };
  }
}
