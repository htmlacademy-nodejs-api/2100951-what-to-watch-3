import crypto from 'crypto';
import { FilmType } from '../types/films.type.js';
import { GenresType } from '../types/genres-type.enum.js';

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    name,
    description,
    createdDate,
    genre,
    released,
    rating,
    previewLink,
    videoLink,
    starring,
    director,
    runTime,
    commentsAmount,
    userName,
    userMail,
    userAvatar,
    posterImage,
    backgroundImage,
    backgroundColor
  ] = tokens;

  return {
    name,
    description,
    postDate: new Date(createdDate),
    genre: GenresType[genre as 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Horror' | 'Family' | 'Romance' | 'Scifi' | 'Thriller'],
    released: released,
    rating: Number(rating),
    previewLink,
    videoLink,
    starring: starring.split(', ').map((actor) => (actor)),
    director,
    runTime: Number(runTime),
    comments: Number(commentsAmount),
    user: { name: userName, email: userMail, avatar: userAvatar },
    posterImage,
    backgroundImage,
    backgroundColor
  } as FilmType;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
