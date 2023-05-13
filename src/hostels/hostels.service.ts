import { BadRequestException, Injectable } from '@nestjs/common';
import { Hostel, HostelDocument } from './schemas/hostels.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { HttpService } from '@nestjs/axios';
import { forkJoin } from 'rxjs';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { Params } from 'src/interfaces/params.interface';
import { ListResponse } from 'src/interfaces/list-response.interface';

@Injectable()
export class HostelsService {
    constructor(
        @InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>,
        private httpService: HttpService
    ) {
    }

    async findAll(params: Params): Promise<ListResponse> {
        const query = {
            limit: params.limit || 10,
            skip: params.skip || 0,
            sort: '-updatedAt',
            filter: this.getFilters(params.filter)
        };

        const items = await this.hostelModel
            .find(query.filter)
            .skip(query.skip)
            .limit(query.limit)
            .sort(query.sort)
            .populate({path: 'university', select: "_id name logoImage"});
            
        const count = await this.hostelModel.count(query.filter);

        return {
            items,
            count
        }
    }

    async findById(id: string): Promise<Hostel> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID');
        }

        return (await this.hostelModel.findById(id).populate({path: 'university'}));
    }
    
    async create(files: any, hostelDto: CreateHostelDto): Promise<Hostel> {
        let fileUrls = [];
        
        if(files && files.length) {
            fileUrls = await this.uploadFiles(files);
        }

        hostelDto.photos = fileUrls;      

        const hostel = new this.hostelModel(hostelDto);
        return hostel.save();
    }

    async update(id: string, files: any, hostelDto: UpdateHostelDto): Promise<Hostel> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID');
        }

        let fileUrls = [];

        if(files && files.length) {
            fileUrls = await this.uploadFiles(files);
        }

        hostelDto.photos = fileUrls;      

        return this.hostelModel.findByIdAndUpdate({ _id: id }, hostelDto, {
            upsert: false,
            new: true,
            runValidators: true,
            context: 'query',
        }).exec();
    }

    async delete(id: string): Promise<Hostel> {
        try {
            return await this.hostelModel.findByIdAndRemove(id);
        } catch (error) {
          throw new BadRequestException('Invalid ID');
        }
    }

    private async uploadFiles(files: any): Promise<string[]> {
        const FormData = require("form-data");
        let formData = new FormData();

        const $uploads = [];

        files.forEach(file => {
            formData = new FormData();

            formData.append('image', file.buffer.toString('base64'));

            $uploads.push(this.httpService.post('https://api.imgbb.com/1/upload?expiration=0&key=a7ddfb3f1d94ab05f19d3c684a7162fd', formData))
        });

        return (
            await forkJoin($uploads).toPromise()
        ).map(u => u.data.data.url).filter(u => u);
    }

    private splitParam(param: string): any{
       let paramArr = param.split(':');

       return {
        key: paramArr[0],
        value: paramArr[1]
       }
    }

    private getFilters(filterUnparsed): any{
        let filterQuery = {};

        
        if(filterUnparsed) {
            const filter = this.splitParam(filterUnparsed);
            
            if(filter.key === 'university') {
                filterQuery = {[filter.key]: {$in: [filter.value]}};
            }
            else{
                filterQuery = {[filter.key]: {$regex: filter.value, $options: 'i'}};
            }
        }

        return filterQuery;
    }
}
