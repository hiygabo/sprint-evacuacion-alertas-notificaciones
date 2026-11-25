import { PartialType } from '@nestjs/mapped-types';
import { CreateMacrodistritoDto } from './create-macrodistrito.dto';

export class UpdateMacrodistritoDto extends PartialType(CreateMacrodistritoDto) {}
