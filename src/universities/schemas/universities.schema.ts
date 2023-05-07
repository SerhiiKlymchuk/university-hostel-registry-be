import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as UniqueValidator from 'mongoose-unique-validator';

export type UniversityDocument = University & Document;

@Schema({
  timestamps: true,
})
export class University {
  @Prop({ unique: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  coordinates: Array<string>;
  
  @Prop()
  rector: string;

  @Prop()
  logoImage: string;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const UniversitySchema = SchemaFactory.createForClass(University);

UniversitySchema.plugin(UniqueValidator);
