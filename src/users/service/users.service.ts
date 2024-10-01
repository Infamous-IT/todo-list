import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { GetUserDto } from '../dto/get-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const existingUserByEmail = await this.prismaService.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUserByEmail) {
            throw new ConflictException(
                `User with this email ${createUserDto.email} is already exists!`,
            );
        }

        const createdUser = await this.prismaService.user.create({
            data: createUserDto,
        });

        return createdUser;
    }

    async findOne({ id, email }: GetUserDto) {
        if (!id && !email) {
            throw new BadRequestException();
        }

        const user = await this.prismaService.user.findFirst({
            where: {
                id,
                email,
            },
        });
        return user;
    }
}
