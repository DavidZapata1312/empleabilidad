import 'dotenv/config';
import AppDataSource from "../data-source";
import seedUsers from './users.seed';
import seedTechnologies from './technologies.seed';
import seedVacancies from './vacancies.seed';
import seedApplications from './applications.seed';

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('DataSource initialized');

    await seedUsers();
    await seedTechnologies();
    await seedVacancies();
    await seedApplications();

    console.log('All seeds executed');
  } catch (err) {
    console.error('Seeding error', err);
  } finally {
    await AppDataSource.destroy();
  }
}

run();

