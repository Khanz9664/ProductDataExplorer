import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    addHistory(body: {
        userId: string;
        productId: number;
    }): Promise<{
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
