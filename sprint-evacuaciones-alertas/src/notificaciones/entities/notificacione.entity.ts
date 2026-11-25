import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Alerta } from '../../alertas/entities/alerta.entity';

@Entity('notificaciones')
export class Notificacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    mensaje: string;

    @Column({ default: false })
    leida: boolean;

    @CreateDateColumn({ name: 'fecha_hora' })
    fechaHora: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.notificaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @ManyToOne(() => Alerta, (alerta) => alerta.notificaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_alerta' })
    alerta: Alerta;
}