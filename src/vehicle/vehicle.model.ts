import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type VehicleDocument = Vehicle & Document;

function isValidURL(url: string): boolean {
  const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  return urlRegex.test(url);
}

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (v: string) => /^[A-Za-z\s]+$/.test(v),
      message: 'Brand can only contain letters and spaces.',
    },
  })
  brand: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: (v: string) => /^[A-Za-z0-9\s]+$/.test(v),
      message: 'Model can only contain letters, numbers, and spaces.',
    },
  })
  model: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
    validate: {
      validator: isValidURL,
      message:
        'Image must be a valid URL ending with .png, .jpg, .jpeg, .gif, or .webp',
    },
  })
  image: string;

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

  @Prop({
    required: true,
    min: 18,
    max: 35,
  })
  minAge: number;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    validate: {
      validator: (v: string) =>
        /^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,4}\s?\d{2,4}$/.test(v),
      message:
        'Plate number must be a valid Turkish license plate (e.g., 34 ABC 123)',
    },
  })
  plateNumber: string;
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.plugin(aggregatePaginate);

export { VehicleSchema };
