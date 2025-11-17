import { Category, CategoryResponse, CategoryQueryType } from "@/types";
import qs from "qs";
import axiosInstance from "@/utils/request";
export const getCategoryList = async (params?: CategoryQueryType): Promise<Category[]> => {
  const url = `/api/category?${qs.stringify(params)}`;

  try {
    const result = await axiosInstance.get<CategoryResponse>(url);
    return result.data;
  }
  catch (error) {
    console.error('请求数据失败:', error);
    throw error;
  }
};

export const CategoryPost = async (params: Category) => {
  try {
    const result = await axiosInstance.post('/api/category', params);
    return result;
  }
  catch (error) {
    console.error('添加数据失败:', error);
    throw error;
  }
}

export const deleteCategory = async (id: string) => {
  try {
    const result = await axiosInstance.delete(`/api/category/${id}`);
    return result;
  }
  catch (error) {
    console.error('删除数据失败:', error);
    throw error;
  }
}
