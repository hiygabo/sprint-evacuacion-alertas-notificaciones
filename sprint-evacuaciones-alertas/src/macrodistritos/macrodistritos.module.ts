import { Module } from '@nestjs/common';
import { MacrodistritosService } from './macrodistritos.service';
import { MacrodistritosController } from './macrodistritos.controller';
import { TypeOrmModule} from "@nestjs/typeorm";
import { Macrodistrito} from "./entities/macrodistrito.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Macrodistrito])],
  controllers: [MacrodistritosController],
  providers: [MacrodistritosService],
})
export class MacrodistritosModule {}
