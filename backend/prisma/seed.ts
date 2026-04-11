import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: "782ef9da-6bd2-465d-8794-44b2d27734dd",
      email: "fulano.de.tal@teste.com",
      name: "Fulano de Tal",
      password: await bcrypt.hash("senha123", 10),
    },
  });

  console.log('Usuário de teste criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });