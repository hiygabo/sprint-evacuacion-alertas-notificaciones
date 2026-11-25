import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Directorio } from './entities/directorio.entity';
import { CreateDirectorioDto } from './dto/create-directorio.dto';
import { UpdateDirectorioDto } from './dto/update-directorio.dto';

@Injectable()
export class DirectorioService {
  constructor(
      @InjectRepository(Directorio)
      private readonly repo: Repository<Directorio>,
  ) {}

  create(dto: CreateDirectorioDto) {
    const datos = this.normalizar(dto, true);
    return this.repo.save(this.repo.create(datos));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateDirectorioDto) {
    const existente = await this.findOne(id);
    if (!existente) {
      throw new NotFoundException(`Contacto de emergencia ${id} no encontrado`);
    }

    const datos = this.normalizar(dto);
    if (Object.keys(datos).length === 0) return existente;

    await this.repo.update(id, datos);
    return this.findOne(id);
  }

  async cambiarHabilitado(id: number, habilitado: boolean) {
    if (typeof habilitado !== 'boolean') {
      throw new BadRequestException('El campo habilitado debe ser booleano');
    }
    return this.update(id, { habilitado });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  private normalizar(
      dto: CreateDirectorioDto | UpdateDirectorioDto,
      esCreacion = false,
  ): Partial<Directorio> {
    const datos: Partial<Directorio> = {};
    const campos: Array<'entidad' | 'servicio' | 'telefono'> = [
      'entidad',
      'servicio',
      'telefono',
    ];

    for (const campo of campos) {
      const valor = dto[campo];
      if (valor === undefined) {
        if (esCreacion) {
          throw new BadRequestException(`${campo} es obligatorio`);
        }
        continue;
      }
      if (typeof valor !== 'string' || valor.trim().length === 0) {
        throw new BadRequestException(`${campo} no puede estar vacío`);
      }
      datos[campo] = valor.trim();
    }

    if (dto.habilitado !== undefined) {
      if (typeof dto.habilitado !== 'boolean') {
        throw new BadRequestException('El campo habilitado debe ser booleano');
      }
      datos.habilitado = dto.habilitado;
    }

    return datos;
  }
}
