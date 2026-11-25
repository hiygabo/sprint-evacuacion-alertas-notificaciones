import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Macrodistrito } from './entities/macrodistrito.entity';

@Injectable()
export class MacrodistritosService {
  constructor(
      @InjectRepository(Macrodistrito)
      private readonly repo: Repository<Macrodistrito>,
  ) {}

  create(dto: any) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: any) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}