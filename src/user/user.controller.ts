import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Put,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseFilters,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { DbExceptionFilter } from 'src/filters/db-exception.filter';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('skip') skip, @Query('limit') limit, @Query('filter') filter, @Query('sort') sort) {
    return this.userService.findAll({skip, limit, filter, sort});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @UseFilters(DbExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseFilters(DbExceptionFilter)
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
