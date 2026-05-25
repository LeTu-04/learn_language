import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { CreateCategoryDto, updateCategory } from '../../types/categories';


@Injectable()
export class CategoryService {
    constructor(private readonly prisma : PrismaService){}




    async createCategory (data : CreateCategoryDto, userId : string) {
        if(!userId) {
            throw new BadRequestException('USER_ID_MISSING');
        }
        const category = await this.prisma.category.create({
            data : {
                name : data.name,
                userId : userId
            }
        })
        return category;
    }

    async fetchCategory (userId : string) {
        const data = await this.prisma.category.findMany({
            where : {
                isDeleted : false, userId : userId
            }, orderBy : {
                createdAt : 'desc'
            }
        });
        console.log(data);
        return data;
    }

    async softRemoveCategory (id : number, userId : string) {
        await this.prisma.category.update({
            where : {id, userId : userId},
            data : {isDeleted : true,
                    deletedAt : new Date()
            }
        })
    }

    async updateCategory (id : number, data : updateCategory, userId : string) {
        const category = await this.prisma.category.findFirst({
            where : {id, userId},
        });
        if(!category) {
            throw new BadRequestException('Không tìm thấy Category');
        } 
        if(category.name === data.name) {
            return category;
        }
        return await this.prisma.category.update({
            where : {id, userId },
            data : {name : data.name}
        });
        
    }
}
