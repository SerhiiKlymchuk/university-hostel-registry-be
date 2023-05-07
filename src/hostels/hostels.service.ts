import { BadRequestException, Injectable } from '@nestjs/common';
import { Hostel, HostelDocument } from './schemas/hostels.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { HttpService } from '@nestjs/axios';
import { forkJoin } from 'rxjs';
import { UpdateHostelDto } from './dto/update-hostel.dto';

@Injectable()
export class HostelsService {
    constructor(
        @InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>,
        private httpService: HttpService
    ) {
    }

    async findAll(): Promise<Hostel[]> {
        return await this.hostelModel.find({}).sort({updatedAt: -1})
    }

    async findById(id: string): Promise<Hostel> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID');
        }

        return (await this.hostelModel.findById(id).populate({path: 'university'}));
    }
    
    async create(files: any, hostelDto: CreateHostelDto): Promise<Hostel> {
        if(files && files.length) {
            const fileUrls = await this.uploadFiles(files);
            hostelDto.photos = fileUrls;      
        }

        const hostel = new this.hostelModel(hostelDto);
        return hostel.save();
    }

    async update(id: string, files: any, hostelDto: UpdateHostelDto): Promise<Hostel> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID');
        }

        if(files && files.length) {
            const fileUrls = await this.uploadFiles(files);
            hostelDto.photos = fileUrls;      
        }

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

            $uploads.push(this.httpService.post('https://api.imgbb.com/1/upload?expiration=600&key=a7ddfb3f1d94ab05f19d3c684a7162fd', formData))
        });

        return (
            await forkJoin($uploads).toPromise()
        ).map(u => u.data.data.url);
    }
}
