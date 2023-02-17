import CommentDto from '../../dto/comment/comment.dto.js';
import FilmDto from '../../dto/films/films.dto.js';
import UpdateFilmDto from '../../dto/films/update-film.dto.js';
import UserWithTokenDto from '../../dto/user/user-with-token.dto.js';
import UserDto from '../../dto/user/user.dto.js';

import { Film } from '../../types/film.js';
import { Review } from '../../types/review.js';
import { User } from '../../types/user.js';


export const adaptLoginToClient = (user: UserWithTokenDto): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  token: user.token,
});

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
});


export const adaptFilmToClient = (film: FilmDto): Film => ({
  id: film.id,
  name: film.name,
  posterImage: film.posterImage,
  backgroundImage: film.backgroundImage,
  backgroundColor: film.backgroundColor,
  videoLink: film.videoLink,
  previewVideoLink: film.previewVideoLink,
  description: film.description,
  rating: film.rating,
  director: film.director,
  starring: film.starring,
  runTime: film.runTime,
  genre: film.genre,
  released: film.released,
  isFavorite: film.isFavorite,
  user: adaptUserToClient(film.user),
});

export const adaptEditedFilmToClient = (film: UpdateFilmDto): Film => ({
  id: film.id,
  name: film.name,
  posterImage: film.posterImage,
  backgroundImage: film.backgroundImage,
  backgroundColor: film.backgroundColor,
  videoLink: film.videoLink,
  previewVideoLink: film.previewVideoLink,
  description: film.description,
  rating: film.rating,
  director: film.director,
  starring: film.starring,
  runTime: film.runTime,
  genre: film.genre,
  released: film.released,
  isFavorite: film.isFavorite,
  user: adaptUserToClient(film.user),
});

export const adaptCommentsToClient = (comments: CommentDto[]): Review[] =>
  comments
    .filter((comment: CommentDto) => comment.user !== null)
    .map((comment: CommentDto) => ({
      comment: comment.text,
      date: comment.postDate,
      id: comment.id,
      rating: comment.rating,
      user: adaptUserToClient(comment.user),
    }));

export const adaptCommentToClient = (comment: CommentDto): Review => ({
  comment: comment.text,
  rating: comment.rating,
  id: comment.id,
  user: adaptUserToClient(comment.user),
  date: comment.postDate,
});
