import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type VehicleTemplateDocument = VehicleTemplate & Document;

@Schema({ timestamps: true })
export class VehicleTemplate {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true, unique: true })
  model: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  vehicleType: string;

  @Prop({ required: true })
  doors: number;

  @Prop({ required: true })
  passengers: number;

  @Prop({ required: true })
  transmissionType: string;

  @Prop({ required: true })
  fuelType: string;
}

const VehicleTemplateSchema = SchemaFactory.createForClass(VehicleTemplate);
VehicleTemplateSchema.plugin(aggregatePaginate);

export { VehicleTemplateSchema };
