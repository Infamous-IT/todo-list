import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
        const task = await this.prismaService.task.create({
            data: {
                ...createTaskDto,
                userId,
            },
        });
        return task;
    }

    async findAll(userId: number): Promise<Task[]> {
        return this.prismaService.task.findMany({
            where: { userId },
        });
    }

    async findOne(id: number, userId: number) {
        return await this.getTaskOrThrow(id, userId);
    }

    async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
        await this.getTaskOrThrow(id, userId);

        const updatedTask = await this.prismaService.task.update({
            where: { id, userId },
            data: updateTaskDto,
        });

        return updatedTask;
    }

    async remove(id: number, userId: number) {
        await this.getTaskOrThrow(id, userId);
        return this.prismaService.task.delete({ where: { id, userId } });
    }

    private async getTaskOrThrow(id: number, userId?: number) {
        const task = await this.prismaService.task.findUnique({
            where: { id, userId },
        });

        if (!task) {
            throw new NotFoundException(`Task with ${id} was not found!`);
        }
        return task;
    }
}
