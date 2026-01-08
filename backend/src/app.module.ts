import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ScraperModule } from './scraper/scraper.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, ScraperModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
