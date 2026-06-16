import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { Rating } from './entities/rating.entity';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  /**
   * Create or update a rating for a book
   * POST /ratings
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrUpdate(
    @Body() createRatingDto: CreateRatingDto,
    @CurrentUser() currentUser: ResponseUserDto,
  ): Promise<Rating> {
    return await this.ratingsService.createOrUpdate(
      currentUser.id,
      createRatingDto,
    );
  }

  /**
   * Get current user's rating for a specific book
   * GET /ratings/books/:bookId/me
   */
  @Get('books/:bookId/me')
  @UseGuards(JwtAuthGuard)
  async getMyRating(
    @Param('bookId') bookId: string,
    @CurrentUser() currentUser: ResponseUserDto,
  ): Promise<Rating> {
    const rating = await this.ratingsService.findByUserAndBook(
      currentUser.id,
      parseInt(bookId, 10),
    );

    if (!rating) {
      throw new NotFoundException(
        `No rating found for user ${currentUser.id} and book ${bookId}`,
      );
    }

    return rating;
  }

  /**
   * Get average rating for a book
   * GET /ratings/books/:bookId/average
   */
  @Get('books/:bookId/average')
  async getAverageRating(
    @Param('bookId') bookId: string,
  ): Promise<{ average: number | null; count: number }> {
    return await this.ratingsService.getAverageByBook(parseInt(bookId, 10));
  }
}
