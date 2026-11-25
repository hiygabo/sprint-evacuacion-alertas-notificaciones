import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('directorio_emergencia')
export class Directorio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    entidad: string;

    @Column()
    servicio: string;

    @Column()
    telefono: string;

    @Column({ default: true })
    habilitado: boolean;
}