import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Alerta, EstadoAlerta } from './entities/alerta.entity';
import { AlertaMacrodistrito } from '../alerta-macrodistrito/entities/alerta-macrodistrito.entity';
import { Registro } from '../registros/entities/registro.entity';
import { Notificacion} from "../notificaciones/entities/notificacione.entity";
import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AlertasService {
  constructor(
      @InjectRepository(Alerta)
      private readonly alertaRepo: Repository<Alerta>,
      @InjectRepository(AlertaMacrodistrito)
      private readonly alertaMacroRepo: Repository<AlertaMacrodistrito>,
      @InjectRepository(Registro)
      private readonly registroRepo: Repository<Registro>,
      @InjectRepository(Notificacion)
      private readonly notificacionRepo: Repository<Notificacion>,
      @InjectRepository(Usuario)
      private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // Espera: { titulo, mensajeOficial, gravedad, esTodaLaCiudad, idSismologo, macrodistritoIds: number[] }
  async create(dto: any) {
    const alerta = await this.alertaRepo.save(
        this.alertaRepo.create({
          titulo: dto.titulo,
          mensajeOficial: dto.mensajeOficial,
          gravedad: dto.gravedad,
          esTodaLaCiudad: dto.esTodaLaCiudad ?? false,
          sismologo: { id: dto.idSismologo },
        }),
    );

    const macroIds: number[] = dto.macrodistritoIds || [];

    // Guardar relación en tabla intermedia si no es toda la ciudad
    if (!alerta.esTodaLaCiudad && macroIds.length > 0) {
      const enlaces = macroIds.map((idMacro) =>
          this.alertaMacroRepo.create({
            alerta: { id: alerta.id },
            macrodistrito: { id: idMacro },
          }),
      );
      await this.alertaMacroRepo.save(enlaces);
    }

    // Disparar notificaciones automáticas
    await this.notificarCiudadanos(alerta, macroIds, `Nueva alerta (${alerta.gravedad}): ${alerta.titulo}`);

    return this.findOne(alerta.id);
  }

  findAll() {
    return this.alertaRepo.find({
      relations: {
        sismologo : true,
        macrodistritosAfectados:{
          macrodistrito : true
        }
      },
      order: { fechaEmision: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.alertaRepo.findOne({
      where: { id },
      relations: {
        sismologo : true,
        macrodistritosAfectados:{
          macrodistrito : true
        }
      },
    });
  }

  async update(id: number, dto: any) {
    const { macrodistritoIds, ...datosAlerta } = dto;
    await this.alertaRepo.update(id, datosAlerta);

    const alerta = await this.findOne(id);
    if (!alerta) return null;

    const idsAfectados = alerta.macrodistritosAfectados.map((am) => am.macrodistrito.id);
    const prefijo =
        alerta.estado === EstadoAlerta.CERRADA ? 'Alerta CERRADA' : 'Alerta ACTUALIZADA';

    await this.notificarCiudadanos(alerta, idsAfectados, `${prefijo}: ${alerta.titulo}`);
    return alerta;
  }

  remove(id: number) {
    return this.alertaRepo.delete(id);
  }

  // Lógica interna para generar las notificaciones sin duplicar usuarios
  private async notificarCiudadanos(alerta: Alerta, macroIds: number[], texto: string) {
    let usuarioIds: number[] = [];

    if (alerta.esTodaLaCiudad) {
      const ciudadanos = await this.usuarioRepo.find({ where: { rol: RolUsuario.CIUDADANO } });
      usuarioIds = ciudadanos.map((u) => u.id);
    } else if (macroIds.length > 0) {
      const registros = await this.registroRepo.find({
        where: { macrodistrito: { id: In(macroIds) } },
        relations: {
          macrodistrito: true
        },
      });
      usuarioIds = [...new Set(registros.map((r) => r.usuario.id))];
    }

    if (usuarioIds.length > 0) {
      const notifs = usuarioIds.map((idUsuario) =>
          this.notificacionRepo.create({
            mensaje: `${texto} - ${alerta.mensajeOficial}`,
            usuario: { id: idUsuario },
            alerta: { id: alerta.id },
          }),
      );
      await this.notificacionRepo.save(notifs);
    }
  }
}