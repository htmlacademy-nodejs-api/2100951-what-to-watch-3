import { IsArray, IsDateString, IsEnum, IsInt, IsString, Length } from 'class-validator';
import { GenresType } from '../../../types/genres-type.enum.js';

export default class CreateFilmDto {

  @Length(2, 100, { message: 'Min length is 2, max is 100' })
  public title!: string;

  @Length(20, 1024, { message: 'Min length is 20, max is 1024' })
  public description!: string;

  @IsDateString({}, { message: 'postDate must be valid ISO date' })
  public postDate!: Date;

  @IsEnum(GenresType, { message: 'genre is required' })
  public genre!: GenresType;

  @IsInt({ message: 'released must be an integer' })
  public released!: number;

  public rating!: number;

  @IsString({ message: 'previewVideoLink is required' })
  public previewLink!: string;

  @IsString({ message: 'video is required' })
  public videoLink!: string;

  @IsArray({ message: 'Field starring must be an array' })
  public starring!: string[];

  @IsString({ message: 'director is required' })
  @Length(2, 50, { message: 'Min length is 2, max is 50' })
  public director!: string;

  @IsInt({ message: 'runTime is required' })
  public runTime!: number;

  public userId!: string;

  @IsString({ message: 'backgroundColor is required' })
  public backgroundColor!: string;
}
