import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSlideshowDto } from './dto/create-slideshow.dto';
import { UpdateSlideshowDto } from './dto/update-slideshow.dto';
import { Slideshow } from './entities/slideshow.entity';
import { deleteCloudinaryFile } from '../shared/cloudinary';

@Injectable()
export class SlideshowsService {
  constructor(
    @InjectRepository(Slideshow)
    private slideshowRepository: Repository<Slideshow>,
  ) {}

  async create(createSlideshowDto: CreateSlideshowDto) {
    const newSlideshow = this.slideshowRepository.create(createSlideshowDto);
    return await this.slideshowRepository.save(newSlideshow);
  }

  async findAll() {
    return await this.slideshowRepository.find({
      relations: ['course'],
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findActive() {
    return await this.slideshowRepository.find({
      where: { isActive: true },
      relations: ['course'],
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const slideshow = await this.slideshowRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!slideshow) {
      throw new NotFoundException(`ไม่พบสไลด์โชว์ ID: ${id}`);
    }
    return slideshow;
  }

  async update(id: number, updateSlideshowDto: UpdateSlideshowDto) {
    const slideshow = await this.findOne(id);
    if (
      updateSlideshowDto.imageUrl &&
      slideshow.imageUrl &&
      updateSlideshowDto.imageUrl !== slideshow.imageUrl
    ) {
      await deleteCloudinaryFile(slideshow.imageUrl);
    }
    const updatedSlideshow = Object.assign(slideshow, updateSlideshowDto);
    return await this.slideshowRepository.save(updatedSlideshow);
  }

  async remove(id: number) {
    const slideshow = await this.findOne(id);
    await deleteCloudinaryFile(slideshow.imageUrl);
    await this.slideshowRepository.remove(slideshow);
    return { message: `ลบสไลด์โชว์ ID: ${id} เรียบร้อยแล้ว` };
  }
}
