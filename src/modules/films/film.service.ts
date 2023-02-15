import { types, DocumentType, mongoose } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { Types } from 'mongoose';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { GenresType } from '../../types/genres-type.enum.js';
import { SortType } from '../../types/sort-type.enum.js';
import { UserEntity } from '../user/user.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';

const DEFAULT_FILM_COUNT = 60;

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) { }

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.title}`);

    return result;
  }

  public async findById(filmId: string, userId?: string): Promise<DocumentType<FilmEntity> | null> {
    const userData = !userId ? null :
      await this.userModel
        .aggregate([
          {
            $match: { '_id': new mongoose.Types.ObjectId(userId) },
          },
          {
            $project: { '_id': 0, 'favorites': 1 }
          },
        ]).exec();

    const favorites = !userData ? [] : userData[0].favorites;

    return this.filmModel
      .aggregate([
        {
          $match: { _id: Types.ObjectId.createFromHexString(filmId) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $addFields: {
            isFavorite: {
              $in: ['$_id', favorites]
            },
            userId: '$user'
          }
        }
      ])
      .exec()
      .then((res) => res[0]);
  }

  public async find(count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'movieId',
            as: 'commentData'
          }
        },
        {
          $addFields:
            { id: { $toString: '$_id' }, comments: { $size: '$commentData' } }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $limit: limit
        },
        {
          $sort: { postDate: SortType.Down }
        }
      ]);
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

  public async findByGenreId(genreId: GenresType, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .aggregate([
        {
          $match: { 'genre': genreId },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'movieId',
            as: 'commentData'
          }
        },
        {
          $addFields:
            { id: { $toString: '$_id' }, comments: { $size: '$commentData' } }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $limit: limit
        },
        {
          $sort: { postDate: SortType.Down }
        }
      ]);
  }

  public async findByFavorites(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .find({
        favorites: true
      })
      .populate(['userId', 'genres'])
      .exec();
  }

  public async incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {
        '$inc': {
          commentCount: 1,
        }
      }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({ _id: documentId })) !== null;
  }

  public async countRating(filmId: string, rating: number): Promise<DocumentType<FilmEntity> | null> {
    const movie = await this.findById(filmId);
    const oldRating = movie?.rating ?? 0;
    const ratingsCount = movie?.comments ?? 0;
    const newRating = Number(((rating + oldRating * ratingsCount) / (ratingsCount + 1)).toFixed(1));

    return await this.updateById(
      filmId,
      {
        rating: newRating
      });
  }
}
