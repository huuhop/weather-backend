import { Test, TestingModule } from '@nestjs/testing';
import { WeatherReportService } from './weather-report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WeatherReport } from './entities/weather-report.entity';
import { DataSource } from 'typeorm';

describe('WeatherReportService', () => {
  let service: WeatherReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherReportService,
        {
          provide: getRepositoryToken(WeatherReport),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue({
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
            }),
          },
        },
      ],
    }).compile();
    
    service = module.get<WeatherReportService>(WeatherReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});