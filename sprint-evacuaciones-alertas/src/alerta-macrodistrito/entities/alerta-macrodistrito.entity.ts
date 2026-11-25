import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Alerta } from '../../alertas/entities/alerta.entity';
import { Macrodistrito } from '../../macrodistritos/entities/macrodistrito.entity';

@Entity('alerta_macrodistrito')
@Unique(['alerta', 'macrodistrito'])
export class AlertaMacrodistrito {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Alerta, (alerta) => alerta.macrodistritosAfectados, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_alerta' })
    alerta: Alerta;

    @ManyToOne(() => Macrodistrito, (macro) => macro.alertasMacrodistrito, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_macrodistrito' })
    macrodistrito: Macrodistrito;
}