import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertaMacrodistritoService } from './alerta-macrodistrito.service';
import { CreateAlertaMacrodistritoDto } from './dto/create-alerta-macrodistrito.dto';
import { UpdateAlertaMacrodistritoDto } from './dto/update-alerta-macrodistrito.dto';

@Controller('alerta-macrodistrito')
export class AlertaMacrodistritoController {
  constructor(private readonly alertaMacrodistritoService: AlertaMacrodistritoService) {}

  @Post()
  create(@Body() createAlertaMacrodistritoDto: CreateAlertaMacrodistritoDto) {
    return this.alertaMacrodistritoService.create(createAlertaMacrodistritoDto);
  }

  @Get()
  findAll() {
    return this.alertaMacrodistritoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertaMacrodistritoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertaMacrodistritoDto: UpdateAlertaMacrodistritoDto) {
    return this.alertaMacrodistritoService.update(+id, updateAlertaMacrodistritoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertaMacrodistritoService.remove(+id);
  }
}
