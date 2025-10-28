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

// 定义分类常量数组（用于遍历、渲染下拉框等）
export const BOOK_CATEGORIES = [
  "Novel",
  "Fantasy",
  "Mystery",
  "History",
  "Philosophy",
  "Psychology",
  "Science Fiction",
  "Biography",
] as const;

// 从数组推导出类型（用于类型约束）
//"Novel" | "Fantasy" | "Mystery" | "History" | "Philosophy" | "Psychology" | "Science Fiction" | "Biography"
export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface DataformProps {
  passinData: Book[];
  onPaginationChange?: (pagination: PaginationState) => void;
}