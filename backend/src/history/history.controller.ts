
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post()
    async addHistory(@Body() body: { userId: string; productId: number }) {
        return this.historyService.addToHistory(body.userId, body.productId);
    }

    @Get()
    async getHistory(@Query('userId') userId: string) {
        return this.historyService.getHistory(userId);
    }
}
