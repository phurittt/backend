import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SlideshowsService } from './slideshows.service';
import { CreateSlideshowDto } from './dto/create-slideshow.dto';
import { UpdateSlideshowDto } from './dto/update-slideshow.dto';

@Controller('slideshows')
export class SlideshowsController {
  constructor(private readonly slideshowsService: SlideshowsService) { }

  @Post()
  create(@Body() createSlideshowDto: CreateSlideshowDto) {
    return this.slideshowsService.create(createSlideshowDto);
  }

  @Get()
  findAll() {
    return this.slideshowsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.slideshowsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slideshowsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlideshowDto: UpdateSlideshowDto) {
    return this.slideshowsService.update(+id, updateSlideshowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slideshowsService.remove(+id);
  }
}
