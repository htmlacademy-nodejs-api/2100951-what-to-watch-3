import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { GenresType } from '../../types/genres-type.enum.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface FilmEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})

export class FilmEntity extends defaultClasses.TimeStamps {
    @prop({ trim: true, required: true })
  public title!: string;

    @prop({ trim: true, required: true })
    public description!: string;

    @prop()
    public postDate!: Date;

    @prop({
      type: () => String,
      enum: GenresType
    })
    public genre!: GenresType;

    @prop({ required: true })
    public released!: number;

    @prop({ default: 0 })
    public rating!: number;

    @prop({ required: true })
    public previewLink!: string;

    @prop({ required: true })
    public videoLink!: string;

    @prop({ required: true })
    public starring!: string[];

    @prop({ required: true })
    public director!: string;

    @prop({ required: true })
    public runTime!: number;

    @prop({ default: 0 })
    public comments!: number;

    @prop({
      ref: UserEntity,
      required: true
    })
    public userId!: Ref<UserEntity>;

    @prop({ required: true })
    public posterImage!: string;

    @prop({ required: true })
    public backgroundImage!: string;

    @prop({ required: true })
    public backgroundColor!: string;

    @prop({default: false})
    public favorites!: boolean;
}

export const FilmModel = getModelForClass(FilmEntity);
