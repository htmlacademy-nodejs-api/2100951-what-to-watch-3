import { IsDateString, IsMongoId, IsString, Length } from 'class-validator';

export default class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'Min length is 5, max is 1024' })
  public text!: string;

  @Length(1, 10, { message: 'Min length is 1, max is 10' })
  public rating!: number;

  @IsDateString({}, { message: 'postDate must be a valid ISO date' })
  public postDate!: Date;

  public userId!: string;

  @IsMongoId({ message: 'filmId field must be a valid id' })
  public filmId!: string;
}
