export interface CategoryResponse {
  data: Category[];
  total: number;
  success: boolean;
}

export interface Category {
  id?: number;
  createdAt?: number;
  name?: string;
  level?: string;
  parentCategory?: Category;
}
export interface CategoryQueryType {
  name?: string;
  level?: number;
  all?: boolean;
  current?: number;
  pageSize?: number;
}