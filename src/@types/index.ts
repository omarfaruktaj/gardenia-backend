export interface Pagination {
  page: number;
  totalPage: number;
  limit: number;
  next?: number;
  prev?: number;
  total: number;
}
export interface QueryString {
  searchTerm?: string;
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
