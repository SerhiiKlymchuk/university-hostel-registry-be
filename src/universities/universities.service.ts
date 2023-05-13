import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { InjectModel } from '@nestjs/mongoose';
import { University, UniversityDocument } from './schemas/universities.schema';
import { Model, Types } from 'mongoose';
import { Params } from 'src/interfaces/params.interface';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University.name)
    private universityModel: Model<UniversityDocument>,
  ) {}

  async findAll(params: Params): Promise<University[]> {
    const query = {
      limit: params.limit || 10,
      skip: params.skip || 0,
      sort: '-updatedAt',
      filter: this.getFilters(params.filter),
    };

    return await this.universityModel
      .find(query.filter)
      .skip(query.skip)
      .limit(query.limit)
      .sort(query.sort);
  }

  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    const university = new this.universityModel(createUniversityDto);
    return university.save();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.universityModel.findById(id);
  }

  async update(
    id: string,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<University> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    return this.universityModel
      .findByIdAndUpdate({ _id: id }, updateUniversityDto, {
        upsert: false,
        new: true,
        runValidators: true,
        context: 'query',
      })
      .exec();
  }

  async delete(id: string): Promise<University> {
    try {
      return await this.universityModel.findByIdAndRemove(id);
    } catch (error) {
      throw new BadRequestException('Invalid ID');
    }
  }

  private splitParam(param: string): any {
    let paramArr = param.split(':');

    return {
      key: paramArr[0],
      value: paramArr[1],
    };
  }

  private getFilters(filterUnparsed): any {
    let filterQuery = {};

    if (filterUnparsed) {
      const filter = this.splitParam(filterUnparsed);
      filterQuery = { [filter.key]: { $regex: filter.value, $options: 'i' } };
    }

    return filterQuery;
  }
}
