import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicleId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: String, required: true })
  plateNumber: string;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'cancelled';
}

const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.plugin(mongoosePaginate);

export { BookingSchema };
