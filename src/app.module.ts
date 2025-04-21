import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherReportModule } from './weather-report/weather-report.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', 
      host: process.env.DB_HOST,  
      port:  +process.env.DB_PORT,  
      username: process.env.DB_USER,  
      password: process.env.DB_PASSWORD,  
      database: process.env.DB_DATABASE,  
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    WeatherReportModule
  ],
})
export class AppModule {}
