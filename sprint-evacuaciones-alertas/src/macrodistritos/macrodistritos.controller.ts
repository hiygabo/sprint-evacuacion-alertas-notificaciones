import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MacrodistritosService } from './macrodistritos.service';
import { CreateMacrodistritoDto } from './dto/create-macrodistrito.dto';
import { UpdateMacrodistritoDto } from './dto/update-macrodistrito.dto';

@Controller('macrodistritos')
export class MacrodistritosController {
  constructor(private readonly macrodistritosService: MacrodistritosService) {}

  @Post()
  create(@Body() createMacrodistritoDto: CreateMacrodistritoDto) {
    return this.macrodistritosService.create(createMacrodistritoDto);
  }

  @Get()
  findAll() {
    return this.macrodistritosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.macrodistritosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMacrodistritoDto: UpdateMacrodistritoDto) {
    return this.macrodistritosService.update(+id, updateMacrodistritoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.macrodistritosService.remove(+id);
  }
}
