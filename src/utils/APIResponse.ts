interface Pagination {
  page: number;
  totalPage: number;
  limit: number;
  next?: number;
  prev?: number;
  total: number;
}

class APIResponse<T> {
  public success: boolean = true;
  constructor(
    public statusCode: number,
    public message: string,
    public data: T,
    public pagination?: Pagination
  ) {}
}

export default APIResponse;
