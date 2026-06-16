import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  authors: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  editorial: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genre: string;

  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
