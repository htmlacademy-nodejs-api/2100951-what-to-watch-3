import { GenresType } from '../../../types/genres-type.enum.js';

export default class CreateFilmDto {
  public name!: string;
  public description!: string;
  public postDate!: Date;
  public genre!: GenresType;
  public released!: string;
  public rating!: number;
  public previewLink!: string;
  public videoLink!: string;
  public starring!: string[];
  public director!: string;
  public runTime!: number;
  public comments!: number;
  public userId!: string;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
}
