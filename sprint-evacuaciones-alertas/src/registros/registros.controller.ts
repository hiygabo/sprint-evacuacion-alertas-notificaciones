import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RegistrosService } from './registros.service';

@Controller('registros')
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  create(@Body() dto: any) {
    return this.registrosService.create(dto);
  }

  @Get()
  findAll() {
    return this.registrosService.findAll();
  }

  @Get('usuario/:idUsuario')
  findByUsuario(@Param('idUsuario') idUsuario: string) {
    return this.registrosService.findByUsuario(+idUsuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrosService.remove(+id);
  }
}