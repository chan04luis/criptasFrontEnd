export interface ApiResponse<T> {
    HttpCode: number;
    HasError: boolean;
    Message: string;
    Result: T;
    errorCode: number;
  }