export declare class ScraperService {
    private readonly logger;
    private getUniqueStoragePath;
    private cleanupStorage;
    scrapeNavigation(): Promise<any[]>;
    scrapeCategory(url: string): Promise<any>;
    scrapeProduct(url: string): Promise<any>;
}
