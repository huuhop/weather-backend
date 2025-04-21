import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherReport } from './entities/weather-report.entity';
import { Between, DataSource, Repository } from 'typeorm';
import axios from 'axios';
import { CreateWeatherReportDto } from './dto/create-weather-report.dto';


@Injectable()
export class WeatherReportService {
  private readonly logger = new Logger(WeatherReportService.name);
  constructor(
    @InjectRepository(WeatherReport)
    private readonly repo: Repository<WeatherReport>,
    private readonly dataSource: DataSource,
  ) { }

  async createWeatherReport(body: CreateWeatherReportDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const now = new Date();
      const threeMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const threeMinutesLater = new Date(now.getTime());

      // Check data for the last 5 minutes
      const existingDB = await queryRunner.manager.findOne(WeatherReport, {
        where: {
          timestamp: Between(threeMinutesAgo, threeMinutesLater),
        },
        order: { timestamp: 'DESC' },
      });
      if (existingDB) {
        this.logger.log('WeatherReportService: Weather data found within the last 5 minutes');
        await queryRunner.commitTransaction();
        return existingDB;
      }

      // Call API to OPENWEATHER
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const res = await axios.get(process.env.OPENWEATHER_URL, {
        params: {
          lat: body.lat,
          lon: body.lon,
          appid: apiKey,
          units: 'metric',
        },
      });

      const data = res.data;
      const timestamp = new Date(data.dt * 1000);

      //Check if the record already exists
      const existingOpenWeather = await queryRunner.manager.findOne(WeatherReport, {
        where: { timestamp },
      });

      if (existingOpenWeather) {
        await queryRunner.commitTransaction();
        return existingOpenWeather;
      }
      // Create and save new reports
      const report = queryRunner.manager.create(WeatherReport, {
        timestamp,
        temperature: data.main.temp,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        cloudCover: data.clouds.all,
      });

      const saved = await queryRunner.manager.save(report);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      this.logger.error('WeatherReportService: Failed to create weather report', err.stack);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Unable to fetch or save weather data');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number = 1, limit: number = 10, sort: { sortBy?: string; sortDirection?: 'asc' | 'desc' } = { sortBy: 'timestamp', sortDirection: 'desc' }): Promise<any> {
    const allowedSortFields = ['timestamp', 'temperature', 'humidity'];
    const sortBy = allowedSortFields.includes(sort.sortBy || '')
      ? sort.sortBy
      : 'timestamp';
    const sortDirection = (sort.sortDirection || 'desc').toUpperCase() as 'ASC' | 'DESC';
    const order: Record<string, 'ASC' | 'DESC'> = {
      [sortBy]: sortDirection,
    };
    const [reports, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order
    });

    return {
      data: reports,
      total,
      page: page,
      limit: limit,
    };
  }

  async findOne(id: number): Promise<WeatherReport> {
    return this.repo.findOneBy({ id });
  }
}
