import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateHostelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsArray()
  coordinates: Array<string>;

  @IsArray()
  @IsMongoId({ each: true })
  university: string;

  @IsString()
  pointColor: string;

  @IsOptional()
  photos: any[];

  @IsDate()
  @IsOptional()
  createdAt: Date = new Date();

  @IsDate()
  @IsOptional()
  updatedAt: Date = new Date();
}
