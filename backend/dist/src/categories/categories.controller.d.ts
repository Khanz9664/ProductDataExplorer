import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
}
