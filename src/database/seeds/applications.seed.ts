import  AppDataSource  from '../data-source';
import { Application } from '../../applications/entities/application.entity';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

export default async function seedApplications() {
  const repo = AppDataSource.getRepository(Application);
  const userRepo = AppDataSource.getRepository(User);
  const vacancyRepo = AppDataSource.getRepository(Vacancy);

  const user = await userRepo.findOne({ where: { email: 'coder@example.com' } });
  const vacancy = await vacancyRepo.findOne({ where: { title: 'Fullstack Developer' } });

  if (!user || !vacancy) {
    console.log('Skipping applications seed: user or vacancy not found');
    return;
  }

  const exists = await repo.findOne({ where: { user: { id: user.id }, vacancy: { id: vacancy.id } } });
  if (exists) {
    console.log('Application already exists, skipping');
    return;
  }

  const app = new Application();
  app.user = user;
  app.vacancy = vacancy;
  await repo.save(app);

  console.log('Applications seeded');
}
