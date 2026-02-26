import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateCategoryDto, updateCategory } from '../../types/vocab';
import { CategoryService } from '../../services/category/category.service';


@Controller('Category')
export class CategoryController {
    constructor(private readonly category : CategoryService) {}
    @Post()
    async create(
        @Body() body : CreateCategoryDto
    ) {
        const data = await this.category.createCategory(body);
        return {
            message : 'Tạo mới Category thành công!',
            data : data,
            STATUS_CODES : 201
        }

    }

    @Get()
    async fetch () {
        const data  = await this.category.fetchCategory();
        return {
            message : 'Lấy dữ liệu thành công!',
            data : data,
            STATUS_CODES : 200
        }
    }
    @HttpCode(204)
    @Delete(':id')
    async softDeleteCategory(
        @Param('id') id : number
    ) {
        await this.category.softRemoveCategory(id);
    }

    @Patch(':id')
    async updateCategory (
        @Param('id', ParseIntPipe) id : number,
        @Body() body : updateCategory
    ) {
        return await this.category.updateCategory(id, body);
    }
}
