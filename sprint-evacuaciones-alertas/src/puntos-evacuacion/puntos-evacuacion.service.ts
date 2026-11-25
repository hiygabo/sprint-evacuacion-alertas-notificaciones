import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuntoEvacuacion} from "./entities/puntos-evacuacion.entity";

@Injectable()
export class PuntosEvacuacionService {
  constructor(
      @InjectRepository(PuntoEvacuacion)
      private readonly repo: Repository<PuntoEvacuacion>,
  ) {}

  // Espera: { nombre, descripcion, direccion, latitud, longitud, idMacrodistrito }
  create(dto: any) {
    const punto = this.repo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      direccion: dto.direccion,
      activo: dto.activo ?? true,
      ubicacion: {
        type: 'Point',
        coordinates: [Number(dto.longitud), Number(dto.latitud)], // [lng, lat]
      },
      macrodistrito: { id: dto.idMacrodistrito },
    });
    return this.repo.save(punto);
  }

  findAll() {
    return this.repo.find({
      relations: {
        macrodistrito:true,
      },
      order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: { macrodistrito: true} });
  }

  async update(id: number, dto: any) {
    const existente = await this.findOne(id);
    if (!existente) {
      throw new NotFoundException(`Punto de evacuación ${id} no encontrado`);
    }

    const data: any = { ...dto };
    if (dto.latitud !== undefined && dto.longitud !== undefined) {
      data.ubicacion = {
        type: 'Point',
        coordinates: [Number(dto.longitud), Number(dto.latitud)],
      };
      delete data.latitud;
      delete data.longitud;
    }
    if (dto.idMacrodistrito) {
      data.macrodistrito = { id: dto.idMacrodistrito };
      delete data.idMacrodistrito;
    }
    if (data.activo !== undefined && typeof data.activo !== 'boolean') {
      throw new BadRequestException('El campo activo debe ser booleano');
    }
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async cambiarActivo(id: number, activo: boolean) {
    if (typeof activo !== 'boolean') {
      throw new BadRequestException('El campo activo debe ser booleano');
    }
    return this.update(id, { activo });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}