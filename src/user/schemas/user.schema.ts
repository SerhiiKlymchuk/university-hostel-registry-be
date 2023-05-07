import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as UniqueValidator from 'mongoose-unique-validator';

export type UserDocument = User & Document;

export enum ROLES {
  EDITOR="EDITOR",
  ADMIN="ADMIN"
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birthDate: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;
  
  @Prop({default: ROLES.EDITOR})
  role: ROLES;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(UniqueValidator);
