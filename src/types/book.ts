/**
 * 图书相关的类型定义
 */

export interface Book {
  publishedAt: number;
  id?: number;
  name: string;
  author: string;
  category: string;
  cover: string;
  description: string;
  stock: number;
}



export interface BookFormData {
  bookName: string;
  author: string;
  category: string;
  Cover: string;
  publishedAt: Date;
  stock: number;
  description: string;
}

export interface QueryParams {
  category?: string;
  author?: string;
  title?: string;
  name?: string; // 用于分类搜索
  level?: string; // 用于分类搜索
  pageIndex?: number;
  pageSize?: number;
}

export interface BookType {
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

