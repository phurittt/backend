import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { ProjectFinance } from './entities/finance.entity';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(ProjectFinance)
    private financeRepository: Repository<ProjectFinance>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto) {
    const newFinance = this.financeRepository.create(createFinanceDto);
    return await this.financeRepository.save(newFinance);
  }

  async findAll() {
    return await this.financeRepository.find({
      relations: ['project'],
      order: { date: 'DESC' },
    });
  }

  async findByProject(projectId: number) {
    return await this.financeRepository.find({
      where: { projectId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const finance = await this.financeRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!finance) {
      throw new NotFoundException(`ไม่พบข้อมูลการเงิน ID: ${id}`);
    }
    return finance;
  }

  async update(id: number, updateFinanceDto: UpdateFinanceDto) {
    const finance = await this.findOne(id);
    const updatedFinance = Object.assign(finance, updateFinanceDto);
    return await this.financeRepository.save(updatedFinance);
  }

  async remove(id: number) {
    const finance = await this.findOne(id);
    await this.financeRepository.remove(finance);
    return { message: `ลบข้อมูลรายรับรายจ่าย ID: ${id} เรียบร้อยแล้ว` };
  }
}
