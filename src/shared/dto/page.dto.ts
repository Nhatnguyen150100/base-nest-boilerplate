import { PaginationMetaDataDto } from './pagination-metadata.dto';

export class PageDto {
  readonly data: Array<any>;
  readonly metaData: PaginationMetaDataDto;

  constructor(data: Array<any>, metaData: PaginationMetaDataDto) {
    this.data = data;
    this.metaData = metaData;
  }
}