import { PartialType } from '@nestjs/mapped-types';
import { CreateSlideshowDto } from './create-slideshow.dto';

export class UpdateSlideshowDto extends PartialType(CreateSlideshowDto) {}
