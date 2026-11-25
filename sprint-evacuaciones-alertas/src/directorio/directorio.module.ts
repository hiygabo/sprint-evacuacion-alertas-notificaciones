import { Module } from '@nestjs/common';
import { DirectorioService } from './directorio.service';
import { DirectorioController } from './directorio.controller';
import {Directorio} from "./entities/directorio.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Directorio])],
  controllers: [DirectorioController],
  providers: [DirectorioService],
})
export class DirectorioModule {}
