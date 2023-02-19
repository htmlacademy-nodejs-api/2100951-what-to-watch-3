import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { NameSpace, APIRoute, DEFAULT_GENRE, HTTP_CODE } from '../const.js';
import CommentDto from '../dto/comment/comment.dto.js';
import FilmDto from '../dto/films/films.dto.js';
import CreateUserWithIdDto from '../dto/user/create-user-with-id.dto.js';
import UserDto from '../dto/user/user.dto.js';
import { dropToken, saveToken } from '../services/token.js';
import { AuthData } from '../types/auth-data.js';
import { Film, CreateFilm } from '../types/film.js';
import { NewReview } from '../types/new-review.js';
import { NewUser } from '../types/new-user.js';
import { Review } from '../types/review.js';
import { Token } from '../types/token.js';
import { User } from '../types/user.js';
import { adaptFilmToClient, adaptCommentsToClient, adaptCommentToClient, adaptUserToClient, adaptLoginToClient } from '../utils/adapters/adaptersToClient.js';
import { adaptEditFilmToServer, adaptImageToServer, adaptCreateFilmToServer, adaptCreateCommentToServer, adaptSignupToServer, adaptAvatarToServer } from '../utils/adapters/adaptersToServer.js';


type Extra = {
  api: AxiosInstance;
};

export const fetchFilms = createAsyncThunk<Film[], undefined, { extra: Extra }>(
  `${NameSpace.Films}/fetchFilms`,
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Film[]>(APIRoute.Films);

    return data;
  }
);

export const fetchFilmsByGenre = createAsyncThunk<
  Film[],
  string,
  { extra: Extra }
>(`${NameSpace.Genre}/fetchFilmsByGenre`, async (genre, { extra }) => {
  const { api } = extra;
  let route = `${APIRoute.Genre}/${genre}`;
  if (genre === DEFAULT_GENRE) {
    route = APIRoute.Films;
  }
  const { data } = await api.get<Film[]>(route);

  return data;
});

export const fetchFilm = createAsyncThunk<Film, string, { extra: Extra }>(
  `${NameSpace.Film}/fetchFilm`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<FilmDto>(`${APIRoute.Films}/${id}`);

    return adaptFilmToClient(data);
  }
);

export const editFilm = createAsyncThunk<Film, Film, { extra: Extra }>(
  `${NameSpace.Film}/editFilm`,
  async (filmData, { extra }) => {
    const { api } = extra;
    const postData = await api.patch<FilmDto>(
      `${APIRoute.Films}/${filmData.id}`,
      adaptEditFilmToServer(filmData)
    );
    if (postData.status === HTTP_CODE.OK && filmData.imageStatus) {
      const postImageApiRoute = `${APIRoute.Films}/${filmData.id}/image`;

      await api.post(postImageApiRoute, adaptImageToServer(filmData.posterImage), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    const { data } = postData;
    return adaptFilmToClient(data);
  }
);

export const addFilm = createAsyncThunk<Film, CreateFilm, { extra: Extra }>(
  `${NameSpace.Film}/addFilm`,
  async (filmData, { extra }) => {
    const { api } = extra;
    const postData = await api.post<FilmDto>(APIRoute.Films, adaptCreateFilmToServer(filmData));

    if (postData.status === HTTP_CODE.CREATED && filmData.imageStatus) {
      const postImageApiRoute = `${APIRoute.Films}/${postData.data.id}/image`;

      await api.post(postImageApiRoute, adaptImageToServer(filmData.posterImage), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const { data } = postData;
    return adaptFilmToClient(data);
  }
);

export const deleteFilm = createAsyncThunk<Film, string, { extra: Extra }>(
  `${NameSpace.Film}/deleteFilm`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.delete<FilmDto>(`${APIRoute.Films}/${id}`);

    return adaptFilmToClient(data);
  }
);

export const fetchReviews = createAsyncThunk<
  Review[],
  string,
  { extra: Extra }
>(`${NameSpace.Reviews}/fetchReviews`, async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<CommentDto[]>(`${APIRoute.Films}/${id}/comments`);

  return adaptCommentsToClient(data);
});

export const postReview = createAsyncThunk<
  Review,
  { id: Review['id']; review: NewReview },
  { extra: Extra }
>(`${NameSpace.Reviews}/postReview`, async ({ id, review }, { extra }) => {
  const { api } = extra;
  const { data } = await api.post<CommentDto>(`${APIRoute.Comments}`, adaptCreateCommentToServer(review, id));

  return adaptCommentToClient(data);
});

export const checkAuth = createAsyncThunk<User, undefined, { extra: Extra }>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<UserDto>(APIRoute.Login);
      return adaptUserToClient(data);
    } catch (error) {
      dropToken();
      return Promise.reject(error);
    }
  }
);

export const login = createAsyncThunk<User, AuthData, { extra: Extra }>(
  `${NameSpace.User}/login`,
  async (authData, { extra }) => {
    const { api } = extra;

    const { data } = await api.post<UserDto & { token: Token }>(
      APIRoute.Login,
      authData
    );
    const { token } = data;
    saveToken(token);

    return adaptLoginToClient(data);
  }
);

export const logout = createAsyncThunk<void, undefined, { extra: Extra }>(
  `${NameSpace.User}/logout`,
  async (_arg, { extra }) => {
    const { api } = extra;
    await api.delete(APIRoute.Logout);
    dropToken();
  }
);

export const fetchFavoriteFilms = createAsyncThunk<
  Film[],
  undefined,
  { extra: Extra }
>(`${NameSpace.FavoriteFilms}/fetchFavoriteFilms`, async (_arg, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<Film[]>(APIRoute.Favorite);

  return data;
});


export const fetchPromo = createAsyncThunk<Film, undefined, { extra: Extra }>(
  `${NameSpace.Promo}/fetchPromo`,
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<FilmDto>(APIRoute.Promo);

    return adaptFilmToClient(data);
  }
);

export const setFavorite = createAsyncThunk<Film, Film['id'], { extra: Extra }>(
  `${NameSpace.FavoriteFilms}/setFavorite`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<FilmDto>(`${APIRoute.Favorite}/${id}/1`);

    return adaptFilmToClient(data);
  }
);

export const unsetFavorite = createAsyncThunk<
  Film,
  Film['id'],
  { extra: Extra }
>(`${NameSpace.FavoriteFilms}/unsetFavorite`, async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.post<FilmDto>(`${APIRoute.Favorite}/${id}/0`);

  return adaptFilmToClient(data);
});

export const registerUser = createAsyncThunk<void, NewUser, { extra: Extra }>(
  `${NameSpace.User}/register`,
  async (userData, { extra }) => {
    const { api } = extra;
    const postData = await api.post<CreateUserWithIdDto>(APIRoute.Register, adaptSignupToServer(userData));
    if (postData.status === HTTP_CODE.CREATED && userData.avatar) {
      const postAvatarApiRoute = `${APIRoute.User}/${postData.data.id}/avatar`;

      await api.post(postAvatarApiRoute, adaptAvatarToServer(userData.avatar), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  }
);