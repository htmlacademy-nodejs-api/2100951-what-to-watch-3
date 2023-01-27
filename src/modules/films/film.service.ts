import { types, DocumentType, mongoose } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { SortType } from '../../types/sort-type.enum.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';

const DEFAULT_FILM_COUNT = 60;

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) { }

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(filmId)
      .aggregate([
        {
          $match: { '_id': new mongoose.Types.ObjectId(filmId) }
        }
      ])
      .populate('userId')
      .exec();
  }

  public async find(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_FILM_COUNT)
      .populate(['userId', 'genres'])
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, { new: true })
      .populate(['userId', 'genres'])
      .exec();
  }

  public async findByGenreId(genreId: string, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .find({ genres: genreId }, {}, { limit })
      .populate(['userId', 'genres'])
      .exec();
  }

  public async findByFavorites(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .find({
        favorites: true
      })
      .populate(['userId', 'genres'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentCount: 1,
        }
      }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({ _id: documentId })) !== null;
  }
}
