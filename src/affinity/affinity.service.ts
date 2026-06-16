import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Rating } from '../ratings/entities/rating.entity';
import { User } from '../users/entities/user.entity';

export interface AffinityResult {
  similarUser: User;
  comparedBook: { id: number; title: string };
  theirRating: number;
  myRating: number;
  difference: number;
  affinityLevel: number;
}

@Injectable()
export class AffinityService {

  private readonly AFFINITY_THRESHOLD = 0.75;
  private readonly MIN_COMMON_BOOKS = 2; 

  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}


  async getAffinityForUser(
    authenticatedUserId: number,
  ): Promise<AffinityResult[]> {
    const myRatings = await this.ratingRepository.find({
      where: { userId: authenticatedUserId },
      relations: ['book'],
    });

    if (myRatings.length === 0) {
      return [];
    }

    const myBookIds = myRatings.map((r) => r.bookId);
    const otherUsersRatings = await this.ratingRepository.find({
      where: {
        bookId: In(myBookIds),
      },
      relations: ['book', 'user'],
    });

    const userRatingsMap = new Map<
      number,
      Array<{ rating: Rating; myRating: Rating | undefined }>
    >();

    for (const otherRating of otherUsersRatings) {
      if (otherRating.userId === authenticatedUserId) {
        continue; 
      }

      const myRatingForBook = myRatings.find(
        (r) => r.bookId === otherRating.bookId,
      );

      if (!myRatingForBook) {
        continue;
      }

      if (!userRatingsMap.has(otherRating.userId)) {
        userRatingsMap.set(otherRating.userId, []);
      }

      userRatingsMap.get(otherRating.userId)!.push({
        rating: otherRating,
        myRating: myRatingForBook,
      });
    }

    const results: AffinityResult[] = [];

    for (const [userId, commonRatings] of userRatingsMap.entries()) {
      if (commonRatings.length < this.MIN_COMMON_BOOKS) {
        continue;
      }

      const differences = commonRatings.map((item) =>
        Math.abs(item.rating.score - item.myRating!.score),
      );
      const averageDifference =
        differences.reduce((sum, d) => sum + d, 0) / differences.length;
      const affinity = 1 - averageDifference / 4;

      if (affinity < this.AFFINITY_THRESHOLD) {
        continue;
      }

      for (const item of commonRatings) {
        results.push({
          similarUser: item.rating.user,
          comparedBook: {
            id: item.rating.book.id,
            title: item.rating.book.title,
          },
          theirRating: item.rating.score,
          myRating: item.myRating!.score,
          difference: Math.abs(
            item.rating.score - item.myRating!.score,
          ),
          affinityLevel: parseFloat(affinity.toFixed(4)), 
        });
      }
    }


    results.sort((a, b) => {
      if (b.affinityLevel !== a.affinityLevel) {
        return b.affinityLevel - a.affinityLevel;
      }
      return a.similarUser.id - b.similarUser.id;
    });

    return results;
  }
}
