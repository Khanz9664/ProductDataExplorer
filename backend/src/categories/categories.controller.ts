import { Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.categoriesService.findOne(slug);
    }

    @Post(':slug/refresh')
    refresh(@Param('slug') slug: string) {
        return this.categoriesService.refresh(slug);
    }
}
