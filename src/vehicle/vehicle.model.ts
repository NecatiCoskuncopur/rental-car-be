import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true })
  brand: string;
  @Prop({ required: true, unique: true })
  model: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: number;
  @Prop({
    required: true,
    enum: ['sedan', 'suv', 'hatchback', 'station vagon', 'mpv'],
  })
  vehicleType: string;

  @Prop({
    required: true,
    min: 2,
    max: 5,
  })
  doors: number;

  @Prop({
    required: true,
    min: 2,
    max: 12,
  })
  passengers: number;

  @Prop({
    required: true,
    enum: ['automatic', 'manual'],
  })
  transmissionType: string;

  @Prop({
    required: true,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
  })
  fuelType: string;

  @Prop({ required: true, type: [String] })
  plateNumbers: string[];
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.plugin(aggregatePaginate);

export { VehicleSchema };
