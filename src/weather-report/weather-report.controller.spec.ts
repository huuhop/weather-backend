import { Test, TestingModule } from '@nestjs/testing';
import { WeatherReportController } from './weather-report.controller';
import { WeatherReportService } from './weather-report.service';
import { CreateWeatherReportDto } from './dto/create-weather-report.dto';

describe('WeatherReportController', () => {
  let controller: WeatherReportController;
  let service: WeatherReportService;

  const mockService = {
    createWeatherReport: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherReportController],
      providers: [
        {
          provide: WeatherReportService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<WeatherReportController>(WeatherReportController);
    service = module.get<WeatherReportService>(WeatherReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateReport', () => {
    it('should call service.createWeatherReport and return result', async () => {
      const dto: CreateWeatherReportDto = {
        lat: '10.8231',
        lon: '106.6297',
      };
      const result = { id: 1, ...dto, timestamp: Date.now() };

      mockService.createWeatherReport.mockResolvedValue(result);

      expect(await controller.generateReport(dto)).toEqual(result);
      expect(mockService.createWeatherReport).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllReports', () => {
    it('should return paginated and sorted reports', async () => {
      const result = {
        data: [{ id: 1, temperature: 30 }],
        total: 1,
      };

      mockService.findAll.mockResolvedValue(result);

      const response = await controller.getAllReports(1, 10, {
        sortBy: 'timestamp',
        sortDirection: 'desc',
      });

      expect(response).toEqual(result);
      expect(mockService.findAll).toHaveBeenCalledWith(1, 10, {
        sortBy: 'timestamp',
        sortDirection: 'desc',
      });
    });
  });

  describe('getReport', () => {
    it('should return a single report by id', async () => {
      const result = { id: 1, temperature: 20 };
      mockService.findOne.mockResolvedValue(result);

      expect(await controller.getReport('1')).toEqual(result);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
