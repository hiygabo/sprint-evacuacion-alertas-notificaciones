import { Injectable } from '@nestjs/common';
import { CreateAlertaMacrodistritoDto } from './dto/create-alerta-macrodistrito.dto';
import { UpdateAlertaMacrodistritoDto } from './dto/update-alerta-macrodistrito.dto';

@Injectable()
export class AlertaMacrodistritoService {
  create(createAlertaMacrodistritoDto: CreateAlertaMacrodistritoDto) {
    return 'This action adds a new alertaMacrodistrito';
  }

  findAll() {
    return `This action returns all alertaMacrodistrito`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alertaMacrodistrito`;
  }

  update(id: number, updateAlertaMacrodistritoDto: UpdateAlertaMacrodistritoDto) {
    return `This action updates a #${id} alertaMacrodistrito`;
  }

  remove(id: number) {
    return `This action removes a #${id} alertaMacrodistrito`;
  }
}
