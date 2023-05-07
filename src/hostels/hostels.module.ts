import { Module } from '@nestjs/common';
import { HostelsController } from './hostels.controller';
import { HostelsService } from './hostels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hostel, HostelSchema } from './schemas/hostels.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Hostel.name, schema: HostelSchema }]),
  ],
  controllers: [HostelsController],
  providers: [HostelsService]
})
export class HostelsModule {}
