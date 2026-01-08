import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private scraper: ScraperService,
    ) { }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { details: true, category: true },
        });
        if (!product) throw new NotFoundException('Product not found');

        // Scrape details if missing
        if (!product.details) {
            return this.refresh(id);
        }
        return product;
    }

    async refresh(id: number) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');

        const scrapedData = await this.scraper.scrapeProduct(product.sourceUrl);

        // Update product and create/update details
        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                title: scrapedData.title,
                price: scrapedData.price,
                details: {
                    upsert: {
                        create: {
                            description: scrapedData.description,
                            specs: scrapedData.specs,
                            ratingsAvg: scrapedData.ratingsAvg,
                            reviewsCount: scrapedData.reviewsCount,
                        },
                        update: {
                            description: scrapedData.description,
                            specs: scrapedData.specs,
                            ratingsAvg: scrapedData.ratingsAvg,
                            reviewsCount: scrapedData.reviewsCount,
                        },
                    },
                },
                lastScrapedAt: new Date(),
            },
            include: { details: true, category: true },
        });
        return updated;
    }
}
