import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { ControllerInterface } from '../../common/controller/controller.interface.js';
import { Component } from '../../types/component.types.js';
import { FilmServiceInterface } from './film-service.interface.js';
import FilmController from './film.controller.js';
import { FilmEntity, FilmModel } from './film.entity.js';
import FilmService from './film.service.js';

export const filmContainer = new Container();

filmContainer.bind<FilmServiceInterface>(Component.FilmServiceInterface).to(FilmService);
filmContainer.bind<types.ModelType<FilmEntity>>(Component.FilmModel).toConstantValue(FilmModel);
filmContainer.bind<ControllerInterface>(Component.FilmController).to(FilmController).inSingletonScope();
