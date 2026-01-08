import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
  imports: [PrismaModule, ScraperModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
