import { PaginationDto } from './pagination.dto';

export class PaginationMetaDataDto {
  readonly totalPage: number;
  readonly page: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly totalItem: number;

  constructor(totalItem: number, paginationDto: PaginationDto) {
    this.page = paginationDto.page;
    this.totalItem = totalItem;
    this.totalPage = Math.ceil(totalItem / paginationDto.limit);
    this.hasNextPage = this.page < this.totalPage;
    this.hasPreviousPage = this.page > 1;
  }
}
