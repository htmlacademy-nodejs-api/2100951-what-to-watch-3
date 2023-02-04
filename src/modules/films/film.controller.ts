import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import { FilmServiceInterface } from './film-service.interface.js';
import FilmResponse from './responce/film.responce.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import CommentResponse from '../comment/response/comment.response.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middlewares.js';

type RequestQuery = {
  limit?: number;
}

type ParamsGetFilm = {
  filmId: string;
}

type ParamsGetGenre = {
  genre: string;
}

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({
      path: '/', method: HttpMethod.Get, handler: this.index
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateFilmDto)]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({ path: '/genres/:genre', method: HttpMethod.Get, handler: this.findByGenre });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.findByFavorites });
    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
  }

  public async index(
    _req: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response): Promise<void> {
    const films = await this.filmService.find();
    const filmResponse = fillDTO(FilmResponse, films);
    this.send(res, StatusCodes.OK, filmResponse);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {
    const result = await this.filmService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(FilmResponse, result)
    );
  }

  public async show(
    { params }: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const { filmId } = params;
    const film = await this.filmService.findById(filmId);
    this.ok(res, fillDTO(FilmResponse, film));
  }

  public async update(
    { body, params }: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const updatedFilm = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmResponse, updatedFilm));
  }

  public async delete(
    { params }: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const { filmId } = params;
    const film = await this.filmService.deleteById(filmId);
    await this.commentService.deleteByFilmId(filmId);

    this.noContent(res, film);
  }

  public async findByGenre(
    { params, query }: Request<core.ParamsDictionary | ParamsGetGenre, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const films = await this.filmService.findByGenreId(params.genre, query.limit);
    const filmResponse = fillDTO(FilmResponse, films);
    this.ok(res, filmResponse);
  }

  public async findByFavorites(_req: Request, res: Response) {
    const result = await this.filmService.findByFavorites();
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async getComments(
    { params }: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}

