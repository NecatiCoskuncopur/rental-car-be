import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Vehicle, VehicleSchema } from 'src/vehicle/vehicle.model';
import { VehicleTemplateController } from './vehicle-template.controller';
import {
  VehicleTemplate,
  VehicleTemplateSchema,
} from './vehicle-template.model';
import { VehicleTemplateService } from './vehicle-template.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleTemplate.name, schema: VehicleTemplateSchema },
    ]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [VehicleTemplateController],
  providers: [VehicleTemplateService],
})
export class VehicleTemplateModule {}
