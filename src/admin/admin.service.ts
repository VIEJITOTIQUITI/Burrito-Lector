import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { Role } from '../common/enums/role.enum';

export interface DashboardStats {
  totalReaders: number;
  totalBooks: number;
  averageRating: number | null;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,
  ) {}


  async getDashboardStats(): Promise<DashboardStats> {
    const totalReaders = await this.usersRepository.count({
      where: { role: Role.READER },
    });

    const totalBooks = await this.booksRepository.count();

    const ratingResult = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .getRawOne();

    const averageRating = ratingResult?.average
      ? parseFloat(ratingResult.average)
      : null;

    return {
      totalReaders,
      totalBooks,
      averageRating,
    };
  }
}
