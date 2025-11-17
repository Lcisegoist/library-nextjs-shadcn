import { Book, PaginationState } from "./book";
import { Category } from "./category";
import { Borrow } from "./borrow";

export interface DataformProps {
  passinData: (Book | Category | Borrow)[];
  onPaginationChange?: (pagination: PaginationState) => void;
  onDeleteSuccess?: () => void;
  currentPagination?: PaginationState; // 父组件控制的分页状态
  totalCount?: number; // 总数据条数
}