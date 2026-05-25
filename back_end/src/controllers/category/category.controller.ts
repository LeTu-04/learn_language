import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto, updateCategory } from '../../types/categories';
import { CategoryService } from '../../services/category/category.service';
import type { Request } from "express";


@Controller('Category')
export class CategoryController {
    constructor(private readonly category: CategoryService) { }
    @Post()
    async create(
        @Body() body: CreateCategoryDto,
        @Req() req: Request
    ) {
        const user = req.user as any;
        const userId = user?.sub || user?.userId;
        const data = await this.category.createCategory(body, userId);
        return {
            message: 'Tạo mới Category thành công!',
            data: data,
            STATUS_CODES: 201
        }

    }

    @Get()
    async fetch(
        @Req() req: Request
    ) {
        const data = await this.category.fetchCategory(req.user?.sub!);
        return {
            message: 'Lấy dữ liệu thành công!',
            data: data,
            STATUS_CODES: 200
        }
    }
    @HttpCode(204)
    @Delete(':id')
    async softDeleteCategory(
        @Param('id') id: number,
        @Req() req: Request
    ) {
        if (!req.user?.sub) {
            throw new UnauthorizedException()
        }
        await this.category.softRemoveCategory(id, req.user?.sub);
    }

    @Patch(':id')
    async updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: updateCategory,
        @Req() req: Request
    ) {
        if (!req.user?.sub) {
            throw new UnauthorizedException()
        }
        return await this.category.updateCategory(id, body, req.user?.sub);
    }
}
