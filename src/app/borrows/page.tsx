// Categorys.tsx (父组件)

"use client";
import qs from "qs";
import axiosInstance from "@/utils/request";
import DataformTanstack from "@/components/DataformTanstack";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Content from "@/components/Content";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import * as ReactHookForm from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Borrow, PaginationState } from "@/types";
import SelectSearch from "@/components/ui/SelectSearch";
import { getBorrowList } from "@/apis/borrow";

const formSchema = z.object({
  bookName: z.string(),
  status: z.string(),
  userName: z.string(),
});

export default function Borrows() {
  const [borrowlist, setBorrowList] = useState<Borrow[]>([]);
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>({
    bookName: "",
    userName: "",
    status: "",
  });
  const form = ReactHookForm.useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookName: "",
      userName: "",
      status: "",
    },
  });
  const fetchborrowList = useCallback(() => {
    axiosInstance
      .get<{ data: Borrow[]; total: number }>( // **假设API返回 { data: [], total: N } 结构**
        `/api/borrows?${qs.stringify({
          pageIndex: currentPagination.pageIndex, // pageIndex 是 0-based
          pageSize: currentPagination.pageSize,
        })}`
      )
      .then((res) => {
        console.log("fkres", res.data.length);
        setBorrowList(res.data); // 更新当前页数据
      });
  }, [currentPagination.pageIndex, currentPagination.pageSize]);

  useEffect(() => {
    //只在页面初始化调用
    console.log("refreshed:");
    async function fetchBorrowlist() {
      try {
        const data = await getBorrowList();
        setBorrowList(data);
      } catch (error) {
        console.error("获取书籍列表失败:", error);
      }
    }
    fetchBorrowlist();
  }, []);

  const onSubmit1 = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log("category search values:", values);
      setFormValues(values);
      try {
        await getBorrowList({ ...currentPagination, ...values });
        //不更新数据
        //setCategoryData(data);
      } catch (error) {
        console.error("获取分类列表失败:", error);
      }
      // 搜索时会重置到第一页(页面初始化为0)
    },
    [currentPagination]
  );
  //修改分页不自动请求数据
  const handlePaginationChange = useCallback((pagination: PaginationState) => {
    setCurrentPagination(pagination); // 更新状态（异步，不会立即生效）
    getBorrowList(pagination);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    // 删除成功后，重新获取数据，确保使用当前的搜索条件和分页
    fetchborrowList();
  }, [fetchborrowList]);

  return (
    <Content title="借阅列表" url="/borrows/add">
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit1)}
            className="flex flex-row gap-12"
          >
            <div className="w-52">
              <FormField
                control={form.control}
                name="bookName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>书名</FormLabel>
                    <FormControl>
                      <SelectSearch
                        categories={borrowlist.map((item) => ({
                          label: item.book.name,
                          value: item.book.id.toString(),
                        }))}
                        value={field.value.toString()}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* 状态 */}
            <div className="w-28">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="out">借出</SelectItem>
                          <SelectItem value="in">在库</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* 借阅人 */}
            <div className="w-52">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>借阅人</FormLabel>
                    <FormControl>
                      <SelectSearch
                        categories={borrowlist.map((item) => ({
                          label: item.user.name,
                          value: item.user.id,
                        }))}
                        value={field.value.toString()}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <span className="flex items-end">
              <Button type="submit">Search</Button>
            </span>
            <span className="flex items-end">
              <Button
                type="reset"
                onClick={() => {
                  form.reset();
                  setFormValues({
                    bookName: "",
                    userName: "",
                    status: "",
                  });
                  // 清空搜索时，也重置到第一页，并触发数据重新加载
                  setCurrentPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              >
                Clear
              </Button>
            </span>
          </form>
        </Form>

        <DataformTanstack
          passinData={borrowlist}
          onPaginationChange={handlePaginationChange}
          onDeleteSuccess={handleDeleteSuccess}
          currentPagination={currentPagination}
        />
      </>
    </Content>
  );
}
