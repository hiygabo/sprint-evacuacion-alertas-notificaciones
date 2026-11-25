import { PartialType } from '@nestjs/mapped-types';
import { CreatePuntosEvacuacionDto } from './create-puntos-evacuacion.dto';

export class UpdatePuntosEvacuacionDto extends PartialType(CreatePuntosEvacuacionDto) {}
