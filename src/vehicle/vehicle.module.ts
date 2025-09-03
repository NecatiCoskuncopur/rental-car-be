import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  VehicleTemplate,
  VehicleTemplateSchema,
} from 'src/vehicle-template/vehicle-template.model';
import { VehicleController } from './vehicle.controller';
import { Vehicle, VehicleSchema } from './vehicle.model';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    MongooseModule.forFeature([
      { name: VehicleTemplate.name, schema: VehicleTemplateSchema },
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
