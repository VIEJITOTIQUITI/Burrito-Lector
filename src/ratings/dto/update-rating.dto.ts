import { IsInt, Max, Min, IsOptional } from 'class-validator';

export class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  score?: number;
}
