import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffinityController } from './affinity.controller';
import { AffinityService } from './affinity.service';
import { Rating } from '../ratings/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  controllers: [AffinityController],
  providers: [AffinityService],
})
export class AffinityModule {}
