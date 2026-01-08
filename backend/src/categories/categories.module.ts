import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
  imports: [PrismaModule, ScraperModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule { }
