import { Module } from '@nestjs/common';
import { PuntosEvacuacionService } from './puntos-evacuacion.service';
import { PuntosEvacuacionController } from './puntos-evacuacion.controller';
import {PuntoEvacuacion} from "./entities/puntos-evacuacion.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PuntoEvacuacion])],
  controllers: [PuntosEvacuacionController],
  providers: [PuntosEvacuacionService],
})
export class PuntosEvacuacionModule {}
