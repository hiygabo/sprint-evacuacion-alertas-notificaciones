import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Registro } from '../../registros/entities/registro.entity';
import { Alerta } from '../../alertas/entities/alerta.entity';
import { Notificacion} from "../../notificaciones/entities/notificacione.entity";

export enum RolUsuario {
    CIUDADANO = 'CIUDADANO',
    SISMOLOGO = 'SISMOLOGO',
    ADMINISTRADOR = 'ADMINISTRADOR',
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    correo: string;

    @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.CIUDADANO })
    rol: RolUsuario;

    @Column({ default: true })
    activo: boolean;

    @OneToMany(() => Registro, (registro) => registro.usuario)
    registros: Registro[];

    @OneToMany(() => Alerta, (alerta) => alerta.sismologo)
    alertasCreadas: Alerta[];

    @OneToMany(() => Notificacion, (notificacion) => notificacion.usuario)
    notificaciones: Notificacion[];

    @Column({ default: '123456' })
    password: string;
}