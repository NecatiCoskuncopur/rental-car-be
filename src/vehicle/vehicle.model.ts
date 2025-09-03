import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ type: Types.ObjectId, ref: 'VehicleTemplate', required: true })
  templateId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  plateNumber: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  available: boolean;
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.plugin(mongoosePaginate);

export { VehicleSchema };
