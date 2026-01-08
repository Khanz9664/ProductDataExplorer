import { PrismaService } from '../prisma/prisma.service';
export declare class HistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    addToHistory(userId: string, productId: number): Promise<{
        id: number;
        productId: number;
        userId: string;
        visitedAt: Date;
    }>;
    getHistory(userId: string): Promise<({
        product: {
            id: number;
            title: string;
            lastScrapedAt: Date;
            sourceId: string;
            price: string;
            currency: string;
            imageUrl: string | null;
            sourceUrl: string;
            categoryId: number | null;
        };
    } & {
        id: number;
        productId: number;
        userId: string;
        visitedAt: Date;
    })[]>;
}
