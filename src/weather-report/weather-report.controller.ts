import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { WeatherReportService } from './weather-report.service';
import { CreateWeatherReportDto } from './dto/create-weather-report.dto';

@Controller('reports')
export class WeatherReportController {
  constructor(private readonly service: WeatherReportService) {}

  @Post()
  generateReport(@Body() body: CreateWeatherReportDto
  ) {
    return this.service.createWeatherReport(body);
  }

  @Get()
  getAllReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: { sortBy?: string; sortDirection?: 'asc' | 'desc' } = { sortBy: 'timestamp', sortDirection: 'desc' }
  ) {
    return this.service.findAll(page, limit, sort);
  }

  @Get(':id')
  getReport(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }
}
