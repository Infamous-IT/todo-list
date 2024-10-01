import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from '../service/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { CurrentUser } from '../../utils/decorators/current-user.decorator';

@UseGuards(JwtAccessGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(
        @Body() createTaskDto: CreateTaskDto,
        @CurrentUser('id', ParseIntPipe) id: number,
    ) {
        return this.tasksService.create(createTaskDto, id);
    }

    @Get()
    findAll(@CurrentUser('id', ParseIntPipe) id: number) {
        return this.tasksService.findAll(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser('id', ParseIntPipe) userId: number) {
        return this.tasksService.findOne(+id, userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @CurrentUser('id', ParseIntPipe) userId: number,
    ) {
        return this.tasksService.update(+id, updateTaskDto, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser('id', ParseIntPipe) userId: number) {
        return this.tasksService.remove(+id, userId);
    }
}
