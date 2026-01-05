import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Public } from '../common/decorators/public.decorator';
import { SetActiveDto } from './dto/set-active.dto';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR', 'ADMIN')
  @Post()
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    // map query to filters
    const filters: Partial<any> = {};
    if (query.title) filters.title = query.title;
    if (query.seniority) filters.seniority = query.seniority;
    if (query.location) filters.location = query.location;
    if (query.modality) filters.modality = query.modality;
    if (query.company) filters.company = query.company;
    return this.vacanciesService.findAll(filters);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR', 'ADMIN')
  @Patch(':id/active')
  setActive(@Param('id') id: string, @Body() body: SetActiveDto) {
    return this.vacanciesService.setActive(id, body.active);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }
}
