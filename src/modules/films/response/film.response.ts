import {Expose} from 'class-transformer';

export default class FilmResponse {
    @Expose()
  public title!: string;

    @Expose()
    public description!: string;

    @Expose()
    public postDate!: string;

    @Expose()
    public genre!: string;

    @Expose()
    public released!: number;

    @Expose()
    public rating!: number;

    @Expose()
    public previewLink!: string;

    @Expose()
    public videoLink!: string;

    @Expose()
    public starring!: string[];

    @Expose()
    public director!: string;

    @Expose()
    public runTime!: number;

    @Expose()
    public comments!: number;

    @Expose()
    public userId!: string;

    @Expose()
    public posterImage!: string;

    @Expose()
    public backgroundImage!: string;

    @Expose()
    public backgroundColor!: string;
}
