/**
 * 借阅相关的类型定义
 */
import { Book } from "./book";
import { User } from "./user";
export interface Borrow {
  book: Book;
  borrowAt: string
  backAt: string
  user: User
  status: "out" | "in"
  id: number
}

export interface BorrowFormData {
  bookId: number;
  bookName: string;
  borrowerName: string;
  borrowDate: Date;
  returnDate?: Date;
  status: "out" | "in";
}

export interface BorrowResponse {
  data: Borrow[];
  total: number;
  success: boolean;
}

export interface BorrowQueryType {
  name?: string; // 书名
  status?: string; // 状态: "out" | "in"
  borrowerName?: string; // 借阅人姓名
  pageIndex?: number;
  pageSize?: number;
}

