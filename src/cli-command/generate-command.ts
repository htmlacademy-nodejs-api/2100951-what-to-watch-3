import got from 'got';
import TSVFileWriter from '../common/file-reader/file-writer/tsv-file-writer.js';
import FilmGenerator from '../common/file-reader/generator/film-generator.js';
import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const filmCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }

    const filmGeneratorString = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < filmCount; i++) {
      await tsvFileWriter.write(filmGeneratorString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
