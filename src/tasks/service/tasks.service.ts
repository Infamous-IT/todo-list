import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = await this.prismaService.task.create({
            data: createTaskDto,
        });
        return task;
    }

    async findAll() {
        return this.prismaService.task.findMany();
    }

    async findOne(id: number) {
        return await this.getTaskOrThrow(id);
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        await this.getTaskOrThrow(id);

        const updatedTask = await this.prismaService.task.update({
            where: { id },
            data: updateTaskDto,
        });

        return updatedTask;
    }

    async remove(id: number) {
        await this.getTaskOrThrow(id);
        return this.prismaService.task.delete({ where: { id } });
    }

    private async getTaskOrThrow(id: number) {
        const task = await this.prismaService.task.findUnique({
            where: { id },
        });

        if (!task) {
            throw new NotFoundException(`Task with ${id} was not found!`);
        }
        return task;
    }
}
