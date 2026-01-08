import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';

@Injectable()
export class CategoriesService {
    constructor(
        private prisma: PrismaService,
        private scraper: ScraperService,
    ) { }

    async findAll() {
        const categories = await this.prisma.category.findMany({
            where: { parentId: null },
        });
        if (categories.length > 0) return categories;

        // Scrape navigation if empty
        // Scrape navigation if empty
        const navItems = await this.scraper.scrapeNavigation();
        const saved = [];

        // 1. Create Parents first
        const parents = navItems.filter(i => !i.parentTitle);
        for (const item of parents) {
            const cat = await this.prisma.category.upsert({
                where: { slug: this.slugify(item.title) },
                update: {},
                create: {
                    title: item.title,
                    slug: this.slugify(item.title),
                    url: item.url,
                },
            });
            saved.push(cat);
        }

        // 2. Create Children
        const children = navItems.filter(i => i.parentTitle);
        for (const item of children) {
            // Find parent
            const parent = await this.prisma.category.findUnique({
                where: { slug: this.slugify(item.parentTitle) }
            });

            if (parent) {
                await this.prisma.category.upsert({
                    where: { slug: this.slugify(item.title) },
                    update: { parentId: parent.id },
                    create: {
                        title: item.title,
                        slug: this.slugify(item.title),
                        url: item.url,
                        parentId: parent.id
                    },
                });
            }
        }

        return saved; // Return parents (top level)
        return saved;
    }

    async findOne(slug: string) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: { products: true, children: true },
        });

        // Simple cache check: if products are empty or scraped > 1 hour ago (not implemented yet), scrape
        if (!category) return null; // Or throw NotFound
        if (category.products.length === 0) {
            // Scrape
            const scrapedData = await this.scraper.scrapeCategory(category.url);
            // Save products
            for (const p of scrapedData.products) {
                await this.prisma.product.upsert({
                    where: { sourceId: p.sourceId || p.url }, // fallback to url as ID
                    update: {},
                    create: {
                        sourceId: p.sourceId || p.url,
                        title: p.title,
                        price: p.price,
                        currency: 'GBP', // Assumed
                        imageUrl: p.imageUrl,
                        sourceUrl: p.url,
                        category: { connect: { id: category.id } },
                    },
                });
            }
            return this.prisma.category.findUnique({
                where: { slug },
                include: { products: true, children: true },
            });
        }

        return category;
    }

    async refresh(slug: string) {
        const category = await this.prisma.category.findUnique({ where: { slug } });
        if (!category) throw new NotFoundException('Category not found');

        const scrapedData = await this.scraper.scrapeCategory(category.url);

        // Update products
        for (const p of scrapedData.products) {
            await this.prisma.product.upsert({
                where: { sourceId: p.sourceId || p.url },
                update: {
                    price: p.price,
                    // Optionally update other fields if they change on grid view
                },
                create: {
                    sourceId: p.sourceId || p.url,
                    title: p.title,
                    price: p.price,
                    currency: 'GBP',
                    imageUrl: p.imageUrl,
                    sourceUrl: p.url,
                    category: { connect: { id: category.id } },
                },
            });
        }

        await this.prisma.category.update({
            where: { id: category.id },
            data: { lastScrapedAt: new Date() }
        });

        return this.prisma.category.findUnique({
            where: { slug },
            include: { products: true, children: true },
        });
    }

    private slugify(text: string) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
}
