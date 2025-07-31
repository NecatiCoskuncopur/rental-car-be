import { Controller, Get } from '@nestjs/common';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';

@Controller('health')
export class HealthController {
  @ApiRoles('guest')
  @Get()
  check() {
    return { status: 'ok' };
  }
}
