import { Controller, Get, Patch, Param } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  findAll() {
    return this.notificacionesService.findAll();
  }

  @Get('usuario/:idUsuario')
  findByUsuario(@Param('idUsuario') idUsuario: string) {
    return this.notificacionesService.findByUsuario(+idUsuario);
  }

  @Patch(':id/leer')
  marcarComoLeida(@Param('id') id: string) {
    return this.notificacionesService.marcarComoLeida(+id);
  }
}