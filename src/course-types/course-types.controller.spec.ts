import { Test, TestingModule } from '@nestjs/testing';
import { CourseTypesController } from './course-types.controller';
import { CourseTypesService } from './course-types.service';

describe('CourseTypesController', () => {
  let controller: CourseTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseTypesController],
      providers: [CourseTypesService],
    }).compile();

    controller = module.get<CourseTypesController>(CourseTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
