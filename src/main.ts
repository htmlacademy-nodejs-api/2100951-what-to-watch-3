import 'reflect-metadata';
import {Container} from 'inversify';
import {Component} from './types/component.types.js';
import Application from './app/application.js';
import { applicationContainer } from './app/application.container.js';
import { filmContainer } from './modules/films/film.container.js';
import { userContainer } from './modules/user/user.container.js';

const mainContainer = Container.merge(
  applicationContainer,
  filmContainer,
  userContainer
);

async function bootstrap() {
  const application = mainContainer.get<Application>(Component.Application);
  await application.init();
}

bootstrap();
