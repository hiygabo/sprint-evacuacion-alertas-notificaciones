import { Module } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AlertasController } from './alertas.controller';
import { TypeOrmModule} from "@nestjs/typeorm";
import { Alerta} from "./entities/alerta.entity";
import { Registro} from "../registros/entities/registro.entity";
import { AlertaMacrodistrito} from "../alerta-macrodistrito/entities/alerta-macrodistrito.entity";
import { Notificacion} from "../notificaciones/entities/notificacione.entity";
import { Usuario} from "../usuarios/entities/usuario.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Alerta, AlertaMacrodistrito, Registro, Notificacion, Usuario]),
  ],
  controllers: [AlertasController],
  providers: [AlertasService],
})
export class AlertasModule {}
