import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, Dataset, Configuration } from 'crawlee';
import * as fs from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    private getUniqueStoragePath(): string {
        return join(process.cwd(), 'storage', `temp-${randomUUID()}`);
    }

    private async cleanupStorage(path: string) {
        try {
            await fs.rm(path, { recursive: true, force: true });
        } catch (error) {
            this.logger.error(`Failed to clean up storage at ${path}: ${error.message}`);
        }
    }

    async scrapeNavigation(): Promise<any[]> {
        const data: any[] = [];
        const storagePath = this.getUniqueStoragePath();

        const config = new Configuration({
            storageClientOptions: {
                storagePath,
            },
        });

        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                // Wait for menu to be available
                await page.waitForSelector('nav', { timeout: 10000 });

                // Select categories from the menu drawer or main nav
                // Scrape hierarchical navigation
                // Strategy: Find main headers (Parents) and their associated links (Children)
                // WOB structure: .list-menu (Parent) -> .list-menu--disclosure (Children)

                // Get all top-level items
                const navItems = await page.$$eval('.header__menu-item', (els) => {
                    return els.map(el => {
                        const title = el.textContent?.trim();
                        // Find if this has a dropdown
                        const parentUrl = el.getAttribute('href');

                        // We need to return structure. 
                        // It's easier to scrape the flattened lists from the mobile or desktop menu if visible.
                        // Let's try grabbing the distinct groups.

                        // Fallback: Just grab valid links with data attributes if available, 
                        // or better, standard nav structure.

                        // Current best guess based on WOB:
                        // Top level: .list-menu__item--link
                        // It's complex to get hierarchy without robust traversing. 
                        // Let's stick to the flattening strategy but allow subCategory hint.

                        // Actually, looking at debug output from earlier: 
                        // There are multiple ULs with 'list-menu'. 
                        // Let's try to infer hierarchy from `data-menu_category` and `data-menu_subcategory` if present,
                        // otherwise rely on the text and standard links.

                        const link = (el as HTMLAnchorElement);
                        return {
                            title: title,
                            url: link.href,
                            isParent: link.hasAttribute('aria-haspopup'),
                            // Try to find sub-elements? 
                            // This is getting complex for a generic scraper. 
                            // Let's revert to the `data-menu...` attribute strategy but include ALL items.
                        };
                    });
                });

                // BETTER STRATEGY: 
                // Use the data attributes from earlier but DO NOT filter.
                // data-menu_category="Books" data-menu_subcategory="Fiction"
                const structuredItems = await page.$$eval('a[data-menu_category]', (els) => {
                    return els.map(el => ({
                        title: el.getAttribute('data-menu_subcategory')?.trim() || el.getAttribute('data-menu_category')?.trim(),
                        url: (el as HTMLAnchorElement).href,
                        parentTitle: el.getAttribute('data-menu_subcategory') ? el.getAttribute('data-menu_category')?.trim() : null
                    })).filter(item => item.title && item.url);
                });

                data.push(...structuredItems); // Push to external data array

                /* 
                 Original logic was:
                 const navItems = await page.$$eval('a[data-menu_category]', (els) => {
                     ...
                 });
                 */

                // Deduplicate by URL
                const uniqueItems = Array.from(new Map(navItems.map(item => [item.url, item])).values());
                data.push(...uniqueItems);
            },
        }, config);

        try {
            await crawler.run(['https://www.worldofbooks.com/']);
            return data;
        } finally {
            await this.cleanupStorage(storagePath);
        }
    }

    async scrapeCategory(url: string): Promise<any> {
        const products: any[] = [];
        let categoryTitle = '';
        const storagePath = this.getUniqueStoragePath();

        const config = new Configuration({
            storageClientOptions: {
                storagePath,
            },
        });

        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                categoryTitle = await page.title();

                // Wait for product grid
                try {
                    await page.waitForSelector('.ais-InfiniteHits-item', { timeout: 10000 });
                } catch (e) {
                    this.logger.warn(`No products found for ${url}`);
                    return;
                }

                const productEls = await page.$$eval('.ais-InfiniteHits-item', (els) => {
                    return els.map(el => {
                        const titleEl = el.querySelector('.card__heading a') as HTMLAnchorElement;
                        const priceEl = el.querySelector('.price-item');
                        const imgEl = el.querySelector('.card__inner img') as HTMLImageElement;
                        const authorEl = el.querySelector('.author');

                        return {
                            title: (titleEl as HTMLElement)?.innerText?.trim(),
                            price: priceEl?.textContent?.trim(),
                            url: titleEl?.href,
                            imageUrl: imgEl?.src || imgEl?.getAttribute('data-src'),
                            sourceId: titleEl?.getAttribute('data-item_ean'), // ISBN from data attribute
                            author: (authorEl as HTMLElement)?.innerText?.trim()
                        };
                    });
                });
                products.push(...productEls);
            },
        }, config);

        try {
            await crawler.run([url]);
            return { title: categoryTitle, products };
        } finally {
            await this.cleanupStorage(storagePath);
        }
    }

    async scrapeProduct(url: string): Promise<any> {
        let productData: any = {};
        const storagePath = this.getUniqueStoragePath();

        const config = new Configuration({
            storageClientOptions: {
                storagePath,
            },
        });

        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page }) => {
                const title = await page.title();

                // 1. Description: Wait for it explicitly
                let description = '';
                try {
                    // Try multiple selectors
                    const descEl = await page.waitForSelector('.product__description.rte, #description, [itemprop="description"]', { timeout: 3000 }).catch(() => null);
                    if (descEl) {
                        description = await descEl.innerText();
                    }
                } catch (e) {
                    this.logger.warn(`Description not found for ${url}`);
                }

                const price = await page.locator('.price-item').first().textContent();
                const mainImage = await page.getAttribute('.product__media img', 'src');

                // 2. Specs: Handle both TH and TD as keys
                const specs = await page.$$eval('table tr', (rows) => {
                    const extracted: any = {};
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

                // 3. Recommendations (Algolia)
                let recommendations: any[] = [];
                try {
                    // Wait briefly for Algolia to load
                    await page.waitForSelector('.algolia-recommendation', { timeout: 3000 }).catch(() => null);
                    recommendations = await page.$$eval('.algolia-recommendation .ais-InfiniteHits-item', (els) => {
                        return els.slice(0, 5).map(el => ({
                            title: el.querySelector('.card__heading')?.textContent?.trim(),
                            image: el.querySelector('img')?.src,
                            price: el.querySelector('.price-item')?.textContent?.trim()
                        }));
                    });
                } catch (e) {
                    // Ignore recommendation errors
                }

                // 4. Reviews & Ratings
                // World of Books usually has a Trustpilot widget or built-in reviews.
                // We'll try to find common review aggregators.

                let ratingsAvg = 0;
                let reviewsCount = 0;

                try {
                    // Try finding aggregate rating schema or text
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

                    // Fallback: Check for schema JSON-LD
                    if (!ratingsAvg || !reviewsCount) {
                        const jsonLd = await page.$$eval('script[type="application/ld+json"]', (scripts) => {
                            return scripts.map(s => JSON.parse((s as HTMLElement).innerText));
                        });
                        const productSchema = jsonLd.find(s => s['@type'] === 'Product');
                        if (productSchema && productSchema.aggregateRating) {
                            ratingsAvg = productSchema.aggregateRating.ratingValue;
                            reviewsCount = productSchema.aggregateRating.reviewCount;
                        }
                    }

                } catch (e) {
                    // Ignore rating errors
                }

                // Add recommendations to specs for persistence
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
        } finally {
            await this.cleanupStorage(storagePath);
        }
    }

}
