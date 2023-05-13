import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { HostelsService } from './hostels.service';
import { Hostel } from './schemas/hostels.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { DbExceptionFilter } from 'src/filters/db-exception.filter';

@Controller('hostels')
export class HostelsController {
  constructor(private hostelsService: HostelsService) {}
  
  @Get()
  findAll(@Query('skip') skip, @Query('limit') limit, @Query('filter') filter, @Query('sort') sort): Promise<Hostel[]> {
    return this.hostelsService.findAll({skip, limit, filter, sort});
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
  ): any {
    return this.hostelsService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseFilters(DbExceptionFilter)
  @UseInterceptors(FilesInterceptor('photos'))
  @HttpCode(HttpStatus.CREATED)
  async create(@UploadedFiles() files, @Body() createDto: any) {
    return await this.hostelsService.create(files, createDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseFilters(DbExceptionFilter)
  @UseInterceptors(FilesInterceptor('photos'))
  @HttpCode(HttpStatus.OK)
  async update(@UploadedFiles() files, @Body() updateDto: UpdateHostelDto, @Param('id') id: string) {
    return await this.hostelsService.update(id, files, updateDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.hostelsService.delete(id);
  }
}
