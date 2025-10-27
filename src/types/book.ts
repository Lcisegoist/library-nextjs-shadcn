/**
 * 图书相关的类型定义
 */

export interface Book {
  createdAt: string;
  id: number;
  name: string;
  author: string;
  category: string;
  cover: string;
  description: string;
  stock: number;
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
}

export interface QueryParams {
  category?: string;
  author?: string;
  title?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface Category {
  label: string;
  value: string;
}

export type BookCategory =
  | "Novel"
  | "Fantasy"
  | "Mystery"
  | "History"
  | "Philosophy"
  | "Psychology"
  | "Science Fiction"
  | "Biography";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface DataformProps {
  passinData: Book[];
  onPaginationChange?: (pagination: PaginationState) => void;
}