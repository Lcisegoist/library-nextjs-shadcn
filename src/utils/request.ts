import axios from 'axios';

import type { AxiosRequestConfig, AxiosInstance } from 'axios';
import Router from 'next/router';
import { toast } from 'sonner';
interface AxiosInstanceType extends AxiosInstance {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  request<T>(config: AxiosRequestConfig): Promise<T>;
}

const axiosInstance = (config: AxiosRequestConfig): AxiosInstanceType => {
  const instance = axios.create({
    timeout: 5000,
    ...config
  });
  //请求拦截器,进行请求的改造
  instance.interceptors.request.use(
    (config) => {
      console.log('发送请求:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  //响应拦截器
  instance.interceptors.response.use(
    function (res) {
      // axios 成功响应（2xx）会进入这里
      console.log('ResponseRes:', res);
      const { data } = res;
      console.log('Response data:', data); // 调试日志
      return data;
    },
    function (error) {
      // 请求失败或非 2xx 状态码会进入这里
      console.error('Response error:', error);

      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message || '请求失败';

        if (status === 401) {
          toast.error('登录已过期，请重新登录');
          setTimeout(() => {
            Router.push('/login');
          }, 1000);
        } else {
          toast.error(message);
        }

        return Promise.reject(error);
      } else if (error.request) {
        // 请求已发出但没有收到响应
        toast.error('网络错误，请检查网络连接');
        return Promise.reject(error);
      } else {
        // 其他错误
        toast.error('请求配置错误');
        return Promise.reject(error);
      }
    }
  )
  return instance;
}

export default axiosInstance({});