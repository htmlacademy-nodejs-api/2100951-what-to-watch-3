import { GenresType } from './genres.type';
import { UserType } from './user.type';

export type FilmType = {
  name: string;
  description: string;
  postDate: Date;
  genre: GenresType;
  released: string;
  rating: number;
  previewLink: string;
  videoLink: string;
  starring: string[];
  director: string;
  runTime: number;
  commentsAmount: number;
  user: UserType;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
}

