import { Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Post(':id/refresh')
    refresh(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.refresh(id);
    }
}
