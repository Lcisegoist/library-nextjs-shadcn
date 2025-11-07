export interface Category {
  id: number;
  createdAt: number;
  name: string;
  level: string;
  parentCategory?: string;
}