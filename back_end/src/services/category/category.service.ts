import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { CreateCategoryDto } from '../../types/vocab';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma : PrismaService){}
    async createCategory (data : CreateCategoryDto) {
        const category = await this.prisma.category.create({data})
    }
}
