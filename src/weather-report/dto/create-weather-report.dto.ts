import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWeatherReportDto {
    @IsString()
    @IsNotEmpty()
    lat: string;

    @IsString()
    @IsNotEmpty()
    lon: string;
}
