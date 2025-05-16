import { PaginationMetaDataDto } from './pagination-metadata.dto';

export class PageDto<T> {
  public readonly content: T[];
  public readonly metaData: PaginationMetaDataDto;

  constructor(data: T[], metaData: PaginationMetaDataDto) {
    this.content = data;
    this.metaData = metaData;
  }
}
