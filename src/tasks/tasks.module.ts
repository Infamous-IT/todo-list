import { Module } from '@nestjs/common';
import { TasksService } from './service/tasks.service';
import { TasksController } from './controller/tasks.controller';

@Module({
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
