import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MacrodistritosModule } from './macrodistritos/macrodistritos.module';
import { RegistrosModule } from './registros/registros.module';
import { DirectorioModule } from './directorio/directorio.module';
import { PuntosEvacuacionModule } from './puntos-evacuacion/puntos-evacuacion.module';
import { AlertasModule } from './alertas/alertas.module';
import { AlertaMacrodistritoModule } from './alerta-macrodistrito/alerta-macrodistrito.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule, ConfigService} from "@nestjs/config";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsuariosModule,
    MacrodistritosModule,
    RegistrosModule,
    DirectorioModule,
    PuntosEvacuacionModule,
    AlertasModule,
    AlertaMacrodistritoModule,
    NotificacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
