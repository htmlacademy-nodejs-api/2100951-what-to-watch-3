import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {UserEntity, UserModel} from './user.entity.js';
import {UserServiceInterface} from './user-service.interface.js';
import {Component} from '../../types/component.types.js';
import UserService from './user.services.js';

export const userContainer = new Container();

userContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

