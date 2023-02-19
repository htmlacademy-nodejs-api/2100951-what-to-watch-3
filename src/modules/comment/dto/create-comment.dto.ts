import { IsDateString, IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

export default class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'Min length is 5, max is 1024' })
  public text!: string;

  @IsInt({message: 'rating must be an integer'})
  @Min(1, {message: 'Minimum rating is 1'})
  @Max(10, {message: 'Maximum rating is 10'})
  public rating!: number;

  @IsDateString({}, { message: 'postDate must be a valid ISO date' })
  public postDate!: Date;

  public userId!: string;

  @IsMongoId({ message: 'filmId field must be a valid id' })
  public filmId!: string;
}
