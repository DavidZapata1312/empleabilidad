import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { Technology } from './entities/technology.entity';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) { }

  create(createTechnologyDto: CreateTechnologyDto) {
    const technology = this.technologyRepository.create(createTechnologyDto);
    return this.technologyRepository.save(technology);
  }

  findAll() {
    return this.technologyRepository.find();
  }

  findOne(id: string) {
    return this.technologyRepository.findOne({ where: { id } });
  }

  update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    return `This action updates a #${id} technology`;
  }

  remove(id: string) {
    return `This action removes a #${id} technology`;
  }
}
