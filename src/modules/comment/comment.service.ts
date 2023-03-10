import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentServiceInterface} from './comment-service.interface.js';
import {Component} from '../../types/component.types.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { SortType } from '../../types/sort-type.enum.js';

const DEFAULT_COMMENT_COUNT = 50;

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({filmId})
      .sort({postDate: SortType.Down})
      .limit(DEFAULT_COMMENT_COUNT)
      .populate('userId');
  }

  public async deleteByFilmId(filmId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({filmId})
      .exec();

    return result.deletedCount;
  }
}
