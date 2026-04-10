export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error_code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
