import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';
export declare class CategoriesService {
    private prisma;
    private scraper;
    constructor(prisma: PrismaService, scraper: ScraperService);
    findAll(): Promise<any[]>;
    findOne(slug: string): Promise<({
        children: {
            id: number;
            title: string;
            slug: string;
            url: string;
            parentId: number | null;
            lastScrapedAt: Date;
        }[];
        products: {
            id: number;
            title: string;
            lastScrapedAt: Date;
            sourceId: string;
            price: string;
            currency: string;
            imageUrl: string | null;
            sourceUrl: string;
            categoryId: number | null;
        }[];
    } & {
        id: number;
        title: string;
        slug: string;
        url: string;
        parentId: number | null;
        lastScrapedAt: Date;
    }) | null>;
    refresh(slug: string): Promise<({
        children: {
            id: number;
            title: string;
            slug: string;
            url: string;
            parentId: number | null;
            lastScrapedAt: Date;
        }[];
        products: {
            id: number;
            title: string;
            lastScrapedAt: Date;
            sourceId: string;
            price: string;
            currency: string;
            imageUrl: string | null;
            sourceUrl: string;
            categoryId: number | null;
        }[];
    } & {
        id: number;
        title: string;
        slug: string;
        url: string;
        parentId: number | null;
        lastScrapedAt: Date;
    }) | null>;
    private slugify;
}
