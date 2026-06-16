import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @IsNotEmpty()
  @IsInt()
  bookId: number;
}
