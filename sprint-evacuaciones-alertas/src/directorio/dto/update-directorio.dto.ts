import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectorioDto } from './create-directorio.dto';

export class UpdateDirectorioDto extends PartialType(CreateDirectorioDto) {}
