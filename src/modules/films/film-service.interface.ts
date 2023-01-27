import {DocumentType} from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmEntity } from './film.entity.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  find(): Promise<DocumentType<FilmEntity>[]>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  findByGenreId(genreId: string, count?: number): Promise<DocumentType<FilmEntity>[]>;
  incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findByFavorites(): Promise<DocumentType<FilmEntity>[]>;
  exists(documentId: string): Promise<boolean>;
}
