import { Module } from '@nestjs/common';
import { AlertaMacrodistritoService } from './alerta-macrodistrito.service';
import { AlertaMacrodistritoController } from './alerta-macrodistrito.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AlertaMacrodistrito} from "./entities/alerta-macrodistrito.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AlertaMacrodistrito])],
  controllers: [AlertaMacrodistritoController],
  providers: [AlertaMacrodistritoService],
})
export class AlertaMacrodistritoModule {}
