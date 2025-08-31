import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  surname: string;

  @Prop({
    required: true,
  })
  dateOfBirth: Date;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    default: false,
  })
  isAdmin: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);

export { UserSchema };
