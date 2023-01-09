import dayjs from 'dayjs';
import { GenresType } from '../../../types/genres.type.js';
import { MockData } from '../../../types/mock-data.type.js';
import { UserType } from '../../../types/user.type.js';
import { getRandomItem, generateRandomValue, getRandomItems } from '../../../utils/random.js';
import { FilmGeneratorInterface } from './filn-generator.interface.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 1;
const MAX_RATING = 10;

const MIN_RUN_TIME = 60;
const MAX_RUN_TIME = 222;

const MIN_COMMENTS_AMOUNT = 0;
const MAX_COMMENTS_AMOUNT = 10;

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(): string {
    return [
      getRandomItem<string>(this.mockData.name),
      getRandomItem<string>(this.mockData.description),
      dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString(),
      getRandomItem(Object.values(GenresType)),
      getRandomItem<string>(this.mockData.released),
      generateRandomValue(MIN_RATING, MAX_RATING, 1),
      getRandomItem<string>(this.mockData.previewLink),
      getRandomItem<string>(this.mockData.videoLink),
      getRandomItems<string>(this.mockData.starring).join(';'),
      getRandomItem<string>(this.mockData.director),
      generateRandomValue(MIN_RUN_TIME, MAX_RUN_TIME),
      generateRandomValue(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT),
      getRandomItem<UserType>(this.mockData.users).name,
      getRandomItem<UserType>(this.mockData.users).mail,
      getRandomItem<UserType>(this.mockData.users).avatar,
      getRandomItem<string>(this.mockData.posterImage),
      getRandomItem<string>(this.mockData.backgroundImage),
      getRandomItem<string>(this.mockData.backgroundColor)
    ].join('\t');
  }
}
