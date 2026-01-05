import  AppDataSource  from '../data-source';
import { Technology } from '../../technologies/entities/technology.entity';

export default async function seedTechnologies() {
  const repo = AppDataSource.getRepository(Technology);
  const techs = ['JavaScript', 'TypeScript', 'Node.js', 'React', 'PostgreSQL'];

  for (const name of techs) {
    const exists = await repo.findOne({ where: { name } });
    if (exists) continue;
    const t = new Technology();
    t.name = name;
    await repo.save(t);
  }

  console.log('Technologies seeded');
}

