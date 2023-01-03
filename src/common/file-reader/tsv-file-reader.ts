import { readFileSync } from 'fs';
import { FilmType } from '../../types/films.type.js';
import { GenresType } from '../../types/genres.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): FilmType[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
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
      ]) => ({
        name,
        description,
        postDate: new Date(createdDate),
        genre: GenresType[genre as 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Horror' | 'Family' | 'Romance' | 'Scifi' | 'Thriller'],
        released: released,
        rating: Number(rating),
        previewLink,
        videoLink,
        starring: starring.split(', ')
          .map((actor) => (actor)),
        director,
        runTime: Number(runTime),
        commentsAmount: Number(commentsAmount),
        user: { name: userName, mail: userMail, avatar: userAvatar },
        posterImage,
        backgroundImage,
        backgroundColor
      }));
  }
}
