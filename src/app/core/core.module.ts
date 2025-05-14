//// Módulo central que agrupa y proporciona los servicios y guards de autenticación
// utilizados en toda la aplicación, como AuthService, AuthGuard y AdminGuard.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { AdminGuard } from './guard/admin.guard';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthGuard, AdminGuard, AuthService],
})
export class CoreModule {}
