import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { CreateCategoryDto, updateCategory } from '../../types/categories';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma : PrismaService){}
    async createCategory (data : CreateCategoryDto) {
        const category = await this.prisma.category.create({data})
        return category;
    }

    async fetchCategory () {
        const data = await this.prisma.category.findMany({
            where : {
                isDeleted : false
            }, orderBy : {
                createdAt : 'desc'
            }
        });
        console.log(data);
        return data;
    }

    async softRemoveCategory (id : number) {
        await this.prisma.category.update({
            where : {id},
            data : {isDeleted : true,
                    deletedAt : new Date()
            }
        })
    }

    async updateCategory (id : number, data : updateCategory) {
        const category = await this.prisma.category.findFirst({
            where : {id},
        });
        if(!category) {
            throw new BadRequestException('Không tìm thấy Category');
        } 
        if(category.name === data.name) {
            return category;
        }
        return await this.prisma.category.update({
            where : {id},
            data : {name : data.name}
        });
        
    }
}
