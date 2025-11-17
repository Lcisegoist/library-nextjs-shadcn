import { Borrow, BorrowResponse, BorrowQueryType } from "@/types";
import qs from "qs";
import axiosInstance from "@/utils/request";

export const getBorrowList = async (params?: BorrowQueryType): Promise<Borrow[]> => {
  const url = `/api/borrows?${qs.stringify(params)}`;

  try {
    const result = await axiosInstance.get<BorrowResponse>(url);
    return result.data;
  }
  catch (error) {
    console.error('请求数据失败:', error);
    throw error;
  }
};

export const BorrowPost = async (params: Borrow) => {
  try {
    const result = await axiosInstance.post('/api/borrows', params);
    return result;
  }
  catch (error) {
    console.error('添加数据失败:', error);
    throw error;
  }
}

export const deleteBorrow = async (id: string) => {
  try {
    const result = await axiosInstance.delete(`/api/borrows/${id}`);
    return result;
  }
  catch (error) {
    console.error('删除数据失败:', error);
    throw error;
  }
}

