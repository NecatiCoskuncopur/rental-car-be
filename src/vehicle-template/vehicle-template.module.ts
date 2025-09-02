import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  controllers: [VehicleTemplateController],
  providers: [VehicleTemplateService],
})
export class VehicleTemplateModule {}
