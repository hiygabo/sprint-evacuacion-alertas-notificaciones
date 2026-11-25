import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion} from "./entities/notificacione.entity";

@Injectable()
export class NotificacionesService {
  constructor(
      @InjectRepository(Notificacion)
      private readonly repo: Repository<Notificacion>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: { usuario: true, alerta: true },
      order: { fechaHora: 'DESC' },
    });
  }

  findByUsuario(idUsuario: number) {
    return this.repo.find({
      where: { usuario: { id: idUsuario } },
      relations: {
        alerta: true
      },
      order: { fechaHora: 'DESC' },
    });
  }

  async marcarComoLeida(id: number) {
    await this.repo.update(id, { leida: true });
    return this.repo.findOneBy({ id });
  }
}