import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Module({
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
  ],
  providers: [AuthGuard, AdminGuard],
  exports: [AuthGuard, AdminGuard],
})
export class AuthModule {}
