
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
    constructor(private prisma: PrismaService) { }

    async addToHistory(userId: string, productId: number) {
        // Upsert or create new entry to update timestamp if already exists?
        // For simplicity, just create a new entry for now, or maybe distinct by day.
        // Let's simple create.
        return this.prisma.userHistory.create({
            data: {
                userId,
                productId,
            },
        });
    }

    async getHistory(userId: string) {
        return this.prisma.userHistory.findMany({
            where: { userId },
            orderBy: { visitedAt: 'desc' },
            take: 10,
            include: {
                product: true,
            },
        });
    }
}
