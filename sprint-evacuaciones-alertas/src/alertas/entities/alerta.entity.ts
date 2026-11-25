import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { AlertaMacrodistrito } from '../../alerta-macrodistrito/entities/alerta-macrodistrito.entity';
import { Notificacion} from "../../notificaciones/entities/notificacione.entity";

export enum GravedadAlerta {
    BASICA = 'BASICA',
    MODERADA = 'MODERADA',
    SEVERA = 'SEVERA',
}

export enum EstadoAlerta {
    ACTIVA = 'ACTIVA',
    CERRADA = 'CERRADA',
}

@Entity('alertas')
export class Alerta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column({ name: 'mensaje_oficial', type: 'text' })
    mensajeOficial: string;

    @Column({ type: 'enum', enum: GravedadAlerta, default: GravedadAlerta.BASICA })
    gravedad: GravedadAlerta;

    @Column({ name: 'es_toda_la_ciudad', default: false })
    esTodaLaCiudad: boolean;

    @Column({ type: 'enum', enum: EstadoAlerta, default: EstadoAlerta.ACTIVA })
    estado: EstadoAlerta;

    @CreateDateColumn({ name: 'fecha_emision' })
    fechaEmision: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.alertasCreadas)
    @JoinColumn({ name: 'id_sismologo' })
    sismologo: Usuario;

    @OneToMany(() => AlertaMacrodistrito, (am) => am.alerta)
    macrodistritosAfectados: AlertaMacrodistrito[];

    @OneToMany(() => Notificacion, (notificacion) => notificacion.alerta)
    notificaciones: Notificacion[];
}