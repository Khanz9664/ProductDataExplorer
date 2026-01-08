"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const scraper_service_1 = require("../scraper/scraper.service");
let CategoriesService = class CategoriesService {
    prisma;
    scraper;
    constructor(prisma, scraper) {
        this.prisma = prisma;
        this.scraper = scraper;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            where: { parentId: null },
        });
        if (categories.length > 0)
            return categories;
        const navItems = await this.scraper.scrapeNavigation();
        const saved = [];
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
        const children = navItems.filter(i => i.parentTitle);
        for (const item of children) {
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
        return saved;
        return saved;
    }
    async findOne(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: { products: true, children: true },
        });
        if (!category)
            return null;
        if (category.products.length === 0) {
            const scrapedData = await this.scraper.scrapeCategory(category.url);
            for (const p of scrapedData.products) {
                await this.prisma.product.upsert({
                    where: { sourceId: p.sourceId || p.url },
                    update: {},
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
            return this.prisma.category.findUnique({
                where: { slug },
                include: { products: true, children: true },
            });
        }
        return category;
    }
    async refresh(slug) {
        const category = await this.prisma.category.findUnique({ where: { slug } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        const scrapedData = await this.scraper.scrapeCategory(category.url);
        for (const p of scrapedData.products) {
            await this.prisma.product.upsert({
                where: { sourceId: p.sourceId || p.url },
                update: {
                    price: p.price,
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
    slugify(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        scraper_service_1.ScraperService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map