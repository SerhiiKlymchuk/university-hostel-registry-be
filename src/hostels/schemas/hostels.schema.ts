import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as UniqueValidator from 'mongoose-unique-validator';

export type HostelDocument = Hostel & Document;

@Schema({
  timestamps: true,
})
export class Hostel {
  @Prop({ unique: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  coordinates: Array<string>;
  
  @Prop({ type: Types.ObjectId, ref: 'University' })
  university: string;

  @Prop()
  pointColor: string;

  @Prop()
  photos: string[];

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const HostelSchema = SchemaFactory.createForClass(Hostel);

HostelSchema.plugin(UniqueValidator);
