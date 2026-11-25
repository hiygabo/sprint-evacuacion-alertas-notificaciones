import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertaMacrodistritoDto } from './create-alerta-macrodistrito.dto';

export class UpdateAlertaMacrodistritoDto extends PartialType(CreateAlertaMacrodistritoDto) {}
