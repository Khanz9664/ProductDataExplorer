import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findOne(id: number): Promise<{
        category: {
            id: number;
            title: string;
            slug: string;
            url: string;
            parentId: number | null;
            lastScrapedAt: Date;
        } | null;
        details: {
            id: number;
            productId: number;
            description: string | null;
            specs: import("@prisma/client/runtime/library").JsonValue | null;
            ratingsAvg: number | null;
            reviewsCount: number | null;
        } | null;
    } & {
        id: number;
        title: string;
        lastScrapedAt: Date;
        sourceId: string;
        price: string;
        currency: string;
        imageUrl: string | null;
        sourceUrl: string;
        categoryId: number | null;
    }>;
    refresh(id: number): Promise<{
        category: {
            id: number;
            title: string;
            slug: string;
            url: string;
            parentId: number | null;
            lastScrapedAt: Date;
        } | null;
        details: {
            id: number;
            productId: number;
            description: string | null;
            specs: import("@prisma/client/runtime/library").JsonValue | null;
            ratingsAvg: number | null;
            reviewsCount: number | null;
        } | null;
    } & {
        id: number;
        title: string;
        lastScrapedAt: Date;
        sourceId: string;
        price: string;
        currency: string;
        imageUrl: string | null;
        sourceUrl: string;
        categoryId: number | null;
    }>;
}
