import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClient, Task } from '@prisma/client';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/udpate-task.dto';

@Injectable()
export class TasksService {
  constructor(@Inject(REQUEST) private request: Request & { prisma: PrismaClient }) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.request.prisma.task.create({
      data: createTaskDto,
    });
  }

  findAll(): Promise<Task[]> {
    return this.request.prisma.task.findMany();
  }

  findOne(id: string): Promise<Task> {
    return this.request.prisma.task.findUnique({
      where: { id },
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.request.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  remove(id: string): Promise<Task> {
    return this.request.prisma.task.delete({
      where: { id },
    });
  }
}
