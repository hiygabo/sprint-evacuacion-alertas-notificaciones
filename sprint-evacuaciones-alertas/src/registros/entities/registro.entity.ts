import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Macrodistrito } from '../../macrodistritos/entities/macrodistrito.entity';

@Entity('registros')
@Unique(['usuario', 'macrodistrito'])
export class Registro {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.registros, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @ManyToOne(() => Macrodistrito, (macro) => macro.registros, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_macrodistrito' })
    macrodistrito: Macrodistrito;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;
}