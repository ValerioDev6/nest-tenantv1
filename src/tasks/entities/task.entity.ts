import { Task as PrismaTask } from '@prisma/client';

export class Task implements PrismaTask {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}
