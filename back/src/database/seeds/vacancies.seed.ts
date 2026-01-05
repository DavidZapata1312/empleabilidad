import AppDataSource from '../data-source';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { Technology } from '../../technologies/entities/technology.entity';
import { Modality } from '../../common/enums/modality.enum';

export default async function seedVacancies() {
  const repo = AppDataSource.getRepository(Vacancy);
  const techRepo = AppDataSource.getRepository(Technology);

  const vacanciesData = [
    {
      title: 'Fullstack Developer',
      description: 'Desarrollador Fullstack con experiencia en Node y React',
      seniority: 'Senior',
      softSkills: 'Comunicación, trabajo en equipo',
      location: 'Medellín',
      modality: Modality.REMOTE,
      salaryRange: '$3000 - $5000',
      company: 'Acme Corp',
      maxApplicants: 5,
      technologies: ['JavaScript', 'TypeScript', 'Node.js'],
    },
    {
      title: 'Frontend Developer',
      description: 'Desarrollador Frontend enfocado en React',
      seniority: 'Junior',
      softSkills: 'Atención al detalle',
      location: 'Bogotá',
      modality: Modality.ONSITE,
      salaryRange: '$1000 - $2000',
      company: 'Startup X',
      maxApplicants: 3,
      technologies: ['JavaScript', 'React'],
    },
  ];

  for (const v of vacanciesData) {
    const exists = await repo.findOne({ where: { title: v.title } });
    if (exists) continue;
    const vacancy = new Vacancy();
    vacancy.title = v.title;
    vacancy.description = v.description;
    vacancy.seniority = v.seniority;
    vacancy.softSkills = v.softSkills;
    vacancy.location = v.location;
    vacancy.modality = v.modality;
    vacancy.salaryRange = v.salaryRange;
    vacancy.company = v.company;
    vacancy.maxApplicants = v.maxApplicants;

    vacancy.technologies = [];
    for (const techName of v.technologies) {
      const tech = await techRepo.findOne({ where: { name: techName } });
      if (tech) vacancy.technologies.push(tech);
    }

    await repo.save(vacancy);
  }

  console.log('Vacancies seeded');
}
