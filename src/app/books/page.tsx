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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as ReactHookForm from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import { getBookList } from "@/apis/book";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

import SelectSearch from "@/components/ui/SelectSearch";
import { Book, BookType, PaginationState } from "@/types";

const formSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
});

//Bookform的格式
export function Bookform() {
  const form = ReactHookForm.useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // zod + react-hook-form 联动
    //mode: "onChange", 设置触发zod验证的时机
    defaultValues: {
      title: "",
      author: "",
      category: "",
    },
  });

  return form;
}

export default function Books() {
  const [bookData, setBookData] = useState<Book[]>([]);
  const [bookCategoryList, setBookCategoryList] = useState<BookType[]>([]);
  //存储分页情况
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  //存储搜索内容
  const [searchValues, setSearchValues] = useState<z.infer<typeof formSchema>>({
    title: "",
    author: "",
    category: "",
  });
  const form = ReactHookForm.useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), //每次表单变化时都会触发zod验证
    defaultValues: {
      title: "",
      author: "",
      category: "",
    },
  });

  const fetchBookList = useCallback(() => {
    const { title, author, category } = searchValues;

    axiosInstance
      .get<{ data: Book[]; total: number }>( // **假设API返回 { data: [], total: N } 结构**
        `/api/books?${qs.stringify({
          pageIndex: currentPagination.pageIndex, // pageIndex 是 0-based
          pageSize: currentPagination.pageSize,
          title,
          author,
          category,
        })}`
      )
      .then((res) => {
        console.log("fkres", res.data.length);
        setBookData(res.data); // 更新当前页数据
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPagination.pageIndex,
    currentPagination.pageSize,
    searchValues.title,
    searchValues.author,
    searchValues.category,
  ]);

  useEffect(() => {
    //只在页面初始化调用
    console.log("refreshed:");
    async function fetchBooklist() {
      try {
        const data = await getBookList();
        console.log("cluo", data);
        setBookCategoryList(
          data.map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }))
        );
        console.log("messi", bookCategoryList);
        setBookData(data);
      } catch (error) {
        console.error("获取书籍列表失败:", error);
      }
    }
    fetchBooklist();
    //设置只初始化运行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDeleteSuccess = useCallback(() => {
    fetchBookList();
  }, [fetchBookList]);
  const onSubmit1 = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log("book search values:", values);
      setSearchValues(values);

      try {
        await getBookList({ ...currentPagination, ...values });
        //setBookData(data);
      } catch (error) {
        console.error("获取书籍列表失败:", error);
      }
    },
    [currentPagination]
  );

  // 处理分页变化 - 使用 useCallback 避免不必要的重新渲染
  const handlePaginationChange = useCallback((pagination: PaginationState) => {
    //pagination包含最新的页码信息
    setCurrentPagination(pagination);
    getBookList(pagination);
  }, []);

  // function handleEdit() {
  //   router.push("/books/edit/id1");
  // }

  return (
    <Content title="图书列表" url="/books/add">
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit1)} //提交时触发验证
            className="flex flex-row gap-12"
          >
            <div className="w-52">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Book title"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-52">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Author name"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-52">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <SelectSearch
                        categories={bookCategoryList}
                        value={field.value}
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
                  setSearchValues({
                    title: "",
                    author: "",
                    category: "",
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
          passinData={bookData}
          onPaginationChange={handlePaginationChange}
          onDeleteSuccess={handleDeleteSuccess}
          currentPagination={currentPagination}
        />
      </>
    </Content>
  );
}
