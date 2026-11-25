import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Registro } from '../../registros/entities/registro.entity';
import { PuntoEvacuacion} from "../../puntos-evacuacion/entities/puntos-evacuacion.entity";
import { AlertaMacrodistrito } from '../../alerta-macrodistrito/entities/alerta-macrodistrito.entity';

@Entity('macrodistritos')
export class Macrodistrito {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @OneToMany(() => Registro, (registro) => registro.macrodistrito)
    registros: Registro[];

    @OneToMany(() => PuntoEvacuacion, (punto) => punto.macrodistrito)
    puntosEvacuacion: PuntoEvacuacion[];

    @OneToMany(() => AlertaMacrodistrito, (am) => am.macrodistrito)
    alertasMacrodistrito: AlertaMacrodistrito[];
}