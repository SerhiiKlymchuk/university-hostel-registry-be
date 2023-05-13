import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ROLES, User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Params } from 'src/interfaces/params.interface';

@Injectable()
export class UserService {
  private saltOrRounds = 10;

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findAll(params: Params): Promise<User[]> {
    const query = {
      limit: params.limit || 10,
      skip: params.skip || 0,
      sort: '-updatedAt',
      filter: this.getFilters(params.filter),
    };

    return await this.userModel.find()
      .find(query.filter)
      .skip(query.skip)
      .limit(query.limit)
      .sort(query.sort)
      .select('-password');
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.userModel.findById(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async findOneByRole(role: ROLES): Promise<User> {
    return await this.userModel.findOne({ role: role });
  }

  async createAdmin(): Promise<User> {
    try {
      const adminDto: any = JSON.parse(process.env.ADMIN_USER);
      adminDto.password = await bcrypt.hash(
        adminDto.password,
        this.saltOrRounds,
      );

      const user = new this.userModel(adminDto);

      return user.save();
    } catch (e) {
      console.error(e);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, this.saltOrRounds);
    createUserDto.password = hash;

    const user = new this.userModel(createUserDto);

    return user.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, this.saltOrRounds);
      updateUserDto.password = hash;
    }

    return this.userModel
      .findByIdAndUpdate({ _id: id }, updateUserDto, {
        upsert: false,
        new: true,
        runValidators: true,
        context: 'query',
      })
      .exec();
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.userModel.findByIdAndRemove(id);
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
