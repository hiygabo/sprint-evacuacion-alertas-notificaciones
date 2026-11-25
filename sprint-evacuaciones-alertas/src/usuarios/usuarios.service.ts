import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './entities/usuario.entity';


@Injectable()
export class UsuariosService {
  constructor(
      @InjectRepository(Usuario)
      private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  create(dto: any) {
    return this.usuarioRepository.save(this.usuarioRepository.create(dto));
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  findOne(id: number) {
    return this.usuarioRepository.findOneBy({ id });
  }

  async update(id: number, dto: any) {
    await this.usuarioRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.usuarioRepository.delete(id);
  }

  async login(correo: string, password: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { correo } });
    if (!usuario || usuario.password !== password) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    const { password: _, ...usuarioSinPass } = usuario;
    return usuarioSinPass;
  }

  async register(data: { nombre: string; correo: string; password: string }) {
    const existe = await this.usuarioRepository.findOne({ where: { correo: data.correo } });
    if (existe) {
      throw new ConflictException('Este correo ya está registrado');
    }
    const nuevo = this.usuarioRepository.create({
      ...data,
      rol: RolUsuario.CIUDADANO,
    });
    const guardado = await this.usuarioRepository.save(nuevo);
    const { password: _, ...usuarioSinPass } = guardado;
    return usuarioSinPass;
  }
}