import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function ApiRoles(...roles: ('admin' | 'user' | 'guest')[]) {
  const summary = roles.map((r) => r.toUpperCase()).join(' - ');
  return applyDecorators(ApiOperation({ summary }));
}
