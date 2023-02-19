import { IsOptional, IsDateString, IsInt, IsString, IsArray, IsEnum, Length, IsMongoId } from 'class-validator';
import { GenresType } from '../../../types/genres-type.enum.js';

export default class UpdateFilmDto {
  @IsOptional()
  @Length(2, 100, { message: 'Min length is 2, max is 100' })
  public title?: string;

  @IsOptional()
  @Length(20, 1024, { message: 'Min length is 20, max is 1024' })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'publictionDate must be valid ISO date' })
  public postDate?: Date;

  @IsOptional()
  @IsEnum(GenresType, { message: 'type must be GenreType' })
  public genre?: string;

  @IsOptional()
  @IsInt({ message: 'released must be integer' })
  public released?: number;

  public rating?: number;

  @IsOptional()
  @IsString({ message: '' })
  public preview?: string;

  @IsOptional()
  @IsString({ message: '' })
  public video?: string;

  @IsOptional()
  @IsArray({ message: '' })
  public starring?: string[];

  @IsOptional()
  @IsString({ message: '' })
  @Length(2, 50, { message: '' })
  public director?: string;

  @IsOptional()
  @IsInt({ message: 'run time must be valid' })
  public runTime?: number;

  @IsOptional()
  @IsString({ message: '' })
  @IsMongoId({ message: '' })
  public userId?: number;

  @IsOptional()
  @IsString({ message: '' })
  public posterImage?: string;

  @IsOptional()
  @IsString({ message: '' })
  public backgroundImage?: string;

  @IsOptional()
  @IsString({ message: '' })
  public backgroundColor?: string;
}
