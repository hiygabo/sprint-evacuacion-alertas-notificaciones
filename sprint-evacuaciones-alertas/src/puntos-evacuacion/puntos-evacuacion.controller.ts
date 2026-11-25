import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuntosEvacuacionService } from './puntos-evacuacion.service';
import { CreatePuntosEvacuacionDto } from './dto/create-puntos-evacuacion.dto';
import { UpdatePuntosEvacuacionDto } from './dto/update-puntos-evacuacion.dto';

@Controller('puntos-evacuacion')
export class PuntosEvacuacionController {
  constructor(private readonly puntosEvacuacionService: PuntosEvacuacionService) {}

  @Post()
  create(@Body() createPuntosEvacuacionDto: CreatePuntosEvacuacionDto) {
    return this.puntosEvacuacionService.create(createPuntosEvacuacionDto);
  }

  @Get()
  findAll() {
    return this.puntosEvacuacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntosEvacuacionService.findOne(+id);
  }

  @Patch(':id/activo')
  cambiarActivo(
      @Param('id') id: string,
      @Body('activo') activo: boolean,
  ) {
    return this.puntosEvacuacionService.cambiarActivo(+id, activo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePuntosEvacuacionDto: UpdatePuntosEvacuacionDto) {
    return this.puntosEvacuacionService.update(+id, updatePuntosEvacuacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puntosEvacuacionService.remove(+id);
  }
}
