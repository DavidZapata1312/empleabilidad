import AppDataSource from '../data-source';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export default async function seedUsers() {
  const repo = AppDataSource.getRepository(User);

  const usersData = [
    { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'Administrador' },
    { name: 'Gestor', email: 'gestor@example.com', password: 'gestor123', role: 'Gestor' },
    { name: 'Coder', email: 'coder@example.com', password: 'coder123', role: 'Coder' },
  ];

  for (const u of usersData) {
    const exists = await repo.findOne({ where: { email: u.email } });
    if (exists) continue;
    const user = new User();
    user.name = u.name;
    user.email = u.email;
    user.password = await bcrypt.hash(u.password, 10);
    user.role = u.role;
    await repo.save(user);
  }

  console.log('Users seeded');
}
