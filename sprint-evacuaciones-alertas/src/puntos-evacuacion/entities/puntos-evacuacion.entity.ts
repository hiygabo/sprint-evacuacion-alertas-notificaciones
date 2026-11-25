import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { Point } from 'geojson';
import { Macrodistrito } from '../../macrodistritos/entities/macrodistrito.entity';

@Entity('puntos_evacuacion')
export class PuntoEvacuacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column()
    direccion: string;

    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    ubicacion: Point;

    @Column({ default: true })
    activo: boolean;

    @ManyToOne(() => Macrodistrito, (macro) => macro.puntosEvacuacion)
    @JoinColumn({ name: 'id_macrodistrito' })
    macrodistrito: Macrodistrito;
}