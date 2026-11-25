import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registro } from './entities/registro.entity';

@Injectable()
export class RegistrosService {
  constructor(
      @InjectRepository(Registro)
      private readonly repo: Repository<Registro>,
  ) {}

  create(dto: any) {
    const registro = this.repo.create({
      usuario: { id: dto.idUsuario },
      macrodistrito: { id: dto.idMacrodistrito },
    });
    return this.repo.save(registro);
  }

  findAll() {
    return this.repo.find({ relations: {
        usuario: true,
        macrodistrito: true
      } });
  }

  findByUsuario(idUsuario: number) {
    return this.repo.find({
      where: { usuario: { id: idUsuario } },
      relations: {
        macrodistrito: true
      },
    });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}