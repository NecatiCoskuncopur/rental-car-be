import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 30,
    validate: {
      validator: function (value: string) {
        return (
          /^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/.test(value) && value.trim().length > 0
        );
      },
      message:
        'Name can only contain letters and spaces, and must not be empty or contain only whitespace.',
    },
  })
  name: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 30,
    validate: {
      validator: function (value: string) {
        return (
          /^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/.test(value) && value.trim().length > 0
        );
      },
      message:
        'Name can only contain letters and spaces, and must not be empty or contain only whitespace.',
    },
  })
  surname: string;

  @Prop({
    required: true,
    validate: {
      validator: function (value) {
        if (!(value instanceof Date)) return false;
        const today = new Date();
        const minAgeDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate(),
        );
        return value <= minAgeDate;
      },
      message: 'User must be at least 18 years old.',
    },
  })
  dateOfBirth: Date;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
      },
      message: 'Please provide a valid email address.',
    },
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
