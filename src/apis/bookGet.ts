import { Book, QueryParams } from "@/types";
import qs from "qs";
import axiosInstance from "@/utils/request";
export const getBookList = async (params?: QueryParams): Promise<Book[]> => {
  const url = `/api/books?${qs.stringify(params)}`;

  try {
    const result = await axiosInstance.get<Book[]>(url);
    return result;
  }
  catch (error) {
    console.error('请求数据失败:', error);
    throw error;
  }
};