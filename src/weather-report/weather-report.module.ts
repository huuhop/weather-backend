import { Module } from '@nestjs/common';
import { WeatherReportService } from './weather-report.service';
import { WeatherReportController } from './weather-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherReport } from './entities/weather-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeatherReport,
    ]),
  ],
  controllers: [WeatherReportController],
  providers: [WeatherReportService],
})
export class WeatherReportModule {}
