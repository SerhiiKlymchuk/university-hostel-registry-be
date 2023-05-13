import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  UseFilters,
  Query,
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { DbExceptionFilter } from 'src/filters/db-exception.filter';
import { ListResponse } from 'src/interfaces/list-response.interface';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  findAll(@Query('skip') skip, @Query('limit') limit, @Query('filter') filter, @Query('sort') sort): Promise<ListResponse> {
    return this.universitiesService.findAll({skip, limit, filter, sort});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.universitiesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseFilters(DbExceptionFilter)
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUniversityDto: CreateUniversityDto) {
    return await this.universitiesService.create(createUniversityDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseFilters(DbExceptionFilter)
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ) {
    return await this.universitiesService.update(id, updateUniversityDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.universitiesService.delete(id);
  }
}
