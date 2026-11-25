import { Injectable } from '@nestjs/common';
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
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}