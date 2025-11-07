import { Book, PaginationState } from "./book";
import { Category } from "./category";

export interface DataformProps {
  passinData: Book[] | Category[];
  onPaginationChange?: (pagination: PaginationState) => void;
  onDeleteSuccess?: () => void;
}