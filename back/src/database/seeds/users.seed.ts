import AppDataSource from '../data-source';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export default async function seedUsers() {
  const repo = AppDataSource.getRepository(User);

  const usersData = [
    { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'ADMIN' },
    { name: 'Gestor', email: 'gestor@example.com', password: 'gestor123', role: 'GESTOR' },
    { name: 'Coder', email: 'coder@example.com', password: 'coder123', role: 'CODER' },
  ];

  for (const u of usersData) {
    const exists = await repo.findOne({ where: { email: u.email } });
    if (exists) {
      exists.role = u.role;
      exists.password = await bcrypt.hash(u.password, 10);
      await repo.save(exists);
      console.log(`Updated user ${u.name}`);
      continue;
    }
    const user = new User();
    user.name = u.name;
    user.email = u.email;
    user.password = await bcrypt.hash(u.password, 10);
    user.role = u.role;
    await repo.save(user);
  }

  console.log('Users seeded');
}
