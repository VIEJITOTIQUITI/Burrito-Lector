import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async createOrUpdate(
    userId: number,
    createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    const { bookId, score } = createRatingDto;

    // Check if rating already exists
    let rating = await this.ratingRepository.findOne({
      where: { userId, bookId },
    });

    if (rating) {
      // Update existing rating
      rating.score = score;
      return await this.ratingRepository.save(rating);
    }

    // Create new rating
    rating = this.ratingRepository.create({
      userId,
      bookId,
      score,
    });

    return await this.ratingRepository.save(rating);
  }

  async findByUserAndBook(
    userId: number,
    bookId: number,
  ): Promise<Rating | null> {
    return await this.ratingRepository.findOne({
      where: { userId, bookId },
      relations: ['user', 'book'],
    });
  }

  async getAverageByBook(bookId: number): Promise<{
    average: number | null;
    count: number;
  }> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.bookId = :bookId', { bookId })
      .getRawOne();

    return {
      average: result.average ? parseFloat(result.average) : null,
      count: parseInt(result.count, 10),
    };
  }

  async findRatingById(ratingId: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { id: ratingId },
      relations: ['user', 'book'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${ratingId} not found`);
    }

    return rating;
  }

  async deleteRating(ratingId: number, userId: number): Promise<void> {
    const rating = await this.findRatingById(ratingId);

    if (rating.userId !== userId) {
      throw new BadRequestException(
        'You can only delete your own ratings',
      );
    }

    await this.ratingRepository.remove(rating);
  }
}
