import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideshowsService } from './slideshows.service';
import { SlideshowsController } from './slideshows.controller';
import { Slideshow } from './entities/slideshow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slideshow])],
  controllers: [SlideshowsController],
  providers: [SlideshowsService],
  exports: [TypeOrmModule],
})
export class SlideshowsModule {}
