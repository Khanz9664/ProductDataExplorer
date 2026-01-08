"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var ScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const crawlee_1 = require("crawlee");
const fs = __importStar(require("fs/promises"));
const path_1 = require("path");
const crypto_1 = require("crypto");
let ScraperService = ScraperService_1 = class ScraperService {
    logger = new common_1.Logger(ScraperService_1.name);
    getUniqueStoragePath() {
        return (0, path_1.join)(process.cwd(), 'storage', `temp-${(0, crypto_1.randomUUID)()}`);
    }
    async cleanupStorage(path) {
        try {
            await fs.rm(path, { recursive: true, force: true });
        }
        catch (error) {
            this.logger.error(`Failed to clean up storage at ${path}: ${error.message}`);
        }
    }
    async scrapeNavigation() {
        const data = [];
        const storagePath = this.getUniqueStoragePath();
        const config = new crawlee_1.Configuration({
            storageClientOptions: {
                storagePath,
            },
        });
        const crawler = new crawlee_1.PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                await page.waitForSelector('nav', { timeout: 10000 });
                const navItems = await page.$$eval('.header__menu-item', (els) => {
                    return els.map(el => {
                        const title = el.textContent?.trim();
                        const parentUrl = el.getAttribute('href');
                        const link = el;
                        return {
                            title: title,
                            url: link.href,
                            isParent: link.hasAttribute('aria-haspopup'),
                        };
                    });
                });
                const structuredItems = await page.$$eval('a[data-menu_category]', (els) => {
                    return els.map(el => ({
                        title: el.getAttribute('data-menu_subcategory')?.trim() || el.getAttribute('data-menu_category')?.trim(),
                        url: el.href,
                        parentTitle: el.getAttribute('data-menu_subcategory') ? el.getAttribute('data-menu_category')?.trim() : null
                    })).filter(item => item.title && item.url);
                });
                data.push(...structuredItems);
                const uniqueItems = Array.from(new Map(navItems.map(item => [item.url, item])).values());
                data.push(...uniqueItems);
            },
        }, config);
        try {
            await crawler.run(['https://www.worldofbooks.com/']);
            return data;
        }
        finally {
            await this.cleanupStorage(storagePath);
        }
    }
    async scrapeCategory(url) {
        const products = [];
        let categoryTitle = '';
        const storagePath = this.getUniqueStoragePath();
        const config = new crawlee_1.Configuration({
            storageClientOptions: {
                storagePath,
            },
        });
        const crawler = new crawlee_1.PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                categoryTitle = await page.title();
                try {
                    await page.waitForSelector('.ais-InfiniteHits-item', { timeout: 10000 });
                }
                catch (e) {
                    this.logger.warn(`No products found for ${url}`);
                    return;
                }
                const productEls = await page.$$eval('.ais-InfiniteHits-item', (els) => {
                    return els.map(el => {
                        const titleEl = el.querySelector('.card__heading a');
                        const priceEl = el.querySelector('.price-item');
                        const imgEl = el.querySelector('.card__inner img');
                        const authorEl = el.querySelector('.author');
                        return {
                            title: titleEl?.innerText?.trim(),
                            price: priceEl?.textContent?.trim(),
                            url: titleEl?.href,
                            imageUrl: imgEl?.src || imgEl?.getAttribute('data-src'),
                            sourceId: titleEl?.getAttribute('data-item_ean'),
                            author: authorEl?.innerText?.trim()
                        };
                    });
                });
                products.push(...productEls);
            },
        }, config);
        try {
            await crawler.run([url]);
            return { title: categoryTitle, products };
        }
        finally {
            await this.cleanupStorage(storagePath);
        }
    }
    async scrapeProduct(url) {
        let productData = {};
        const storagePath = this.getUniqueStoragePath();
        const config = new crawlee_1.Configuration({
            storageClientOptions: {
                storagePath,
            },
        });
        const crawler = new crawlee_1.PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                const title = await page.title();
                let description = '';
                try {
                    const descEl = await page.waitForSelector('.product__description.rte, #description, [itemprop="description"]', { timeout: 3000 }).catch(() => null);
                    if (descEl) {
                        description = await descEl.innerText();
                    }
                }
                catch (e) {
                    this.logger.warn(`Description not found for ${url}`);
                }
                const price = await page.locator('.price-item').first().textContent();
                const mainImage = await page.getAttribute('.product__media img', 'src');
                const specs = await page.$$eval('table tr', (rows) => {
                    const extracted = {};
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('th, td');
                        if (cells.length >= 2) {
                            const key = cells[0].textContent?.trim();
                            const value = cells[1].textContent?.trim();
                            if (key && value) {
                                extracted[key.replace(/:$/, '')] = value;
                            }
                        }
                    });
                    return extracted;
                });
                let recommendations = [];
                try {
                    await page.waitForSelector('.algolia-recommendation', { timeout: 3000 }).catch(() => null);
                    recommendations = await page.$$eval('.algolia-recommendation .ais-InfiniteHits-item', (els) => {
                        return els.slice(0, 5).map(el => ({
                            title: el.querySelector('.card__heading')?.textContent?.trim(),
                            image: el.querySelector('img')?.src,
                            price: el.querySelector('.price-item')?.textContent?.trim()
                        }));
                    });
                }
                catch (e) {
                }
                let ratingsAvg = 0;
                let reviewsCount = 0;
                try {
                    const ratingEl = await page.waitForSelector('.rating-value, [itemprop="ratingValue"], .stars-value', { timeout: 1000 }).catch(() => null);
                    if (ratingEl) {
                        const val = await ratingEl.innerText();
                        ratingsAvg = parseFloat(val);
                    }
                    const countEl = await page.waitForSelector('.review-count, [itemprop="reviewCount"]', { timeout: 1000 }).catch(() => null);
                    if (countEl) {
                        const val = await countEl.innerText();
                        reviewsCount = parseInt(val.replace(/[^0-9]/g, ''));
                    }
                    if (!ratingsAvg || !reviewsCount) {
                        const jsonLd = await page.$$eval('script[type="application/ld+json"]', (scripts) => {
                            return scripts.map(s => JSON.parse(s.innerText));
                        });
                        const productSchema = jsonLd.find(s => s['@type'] === 'Product');
                        if (productSchema && productSchema.aggregateRating) {
                            ratingsAvg = productSchema.aggregateRating.ratingValue;
                            reviewsCount = productSchema.aggregateRating.reviewCount;
                        }
                    }
                }
                catch (e) {
                }
                if (recommendations.length > 0) {
                    specs['Recommendations'] = recommendations;
                }
                productData = {
                    title,
                    description,
                    price: price?.trim(),
                    imageUrl: mainImage,
                    specs,
                    ratingsAvg,
                    reviewsCount
                };
            },
        }, config);
        try {
            await crawler.run([url]);
            return productData;
        }
        finally {
            await this.cleanupStorage(storagePath);
        }
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = ScraperService_1 = __decorate([
    (0, common_1.Injectable)()
], ScraperService);
//# sourceMappingURL=scraper.service.js.map