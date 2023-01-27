export default class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public postDate!: Date;
  public userId!: string;
  public filmId!: string;
}
