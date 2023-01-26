import { GenresType } from './genres-type.enum';
import { UserType } from './user.type';

export type FilmType = {
  title: string;
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
  comments: number;
  user: UserType;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
}

