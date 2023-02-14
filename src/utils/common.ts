import * as jose from 'jose';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import crypto from 'crypto';
import { FilmType } from '../types/films.type.js';
import { GenresType } from '../types/genres-type.enum.js';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.type.js';

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title,
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
    title,
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

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algoritm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
