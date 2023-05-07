import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUniversityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsArray()
  coordinates: Array<string>;

  @IsString()
  rector: string;

  @IsOptional()
  logoImage: string;

  @IsDate()
  @IsOptional()
  createdAt: Date = new Date();

  @IsDate()
  @IsOptional()
  updatedAt: Date = new Date();
}
