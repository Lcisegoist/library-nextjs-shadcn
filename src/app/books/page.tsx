"use client";

import DataformTanstack from "@/components/DataformTanstack";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
import { Book, Category, PaginationState, BOOK_CATEGORIES } from "@/types";

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
  //提交处理
  function onSubmit1(values: z.infer<typeof formSchema>) {
    console.log("values:", values);

    getBookList({ ...values, ...currentPagination });
  }
  const [bookData, setBookData] = useState<Book[]>([]);
  //存储分页情况
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //引入book的数据
  useEffect(() => {
    console.log("refreshed:");
    async function fetchBooklist() {
      try {
        const data = await getBookList();
        setBookData(data);
      } catch (error) {
        console.error("获取书籍列表失败:", error);
      }
    }
    fetchBooklist();
  }, []); // 空依赖数组，只在组件挂载时执行一次
  // const router = useRouter();

  // 处理分页变化 - 使用 useCallback 避免不必要的重新渲染
  const handlePaginationChange = useCallback((pagination: PaginationState) => {
    //pagination包含最新的页码信息
    setCurrentPagination(pagination);
    console.log("当前分页状态:", {
      当前页码: pagination.pageIndex + 1, // 显示从1开始的页码
      每页条数: pagination.pageSize,
      原始pageIndex: pagination.pageIndex, // 从0开始
    });

    // 使用最新的 pagination 参数，而不是 currentPagination 状态
    getBookList(pagination);
  }, []);

  // 你可以在这里使用 currentPagination 状态
  // 例如：显示当前分页信息、传递给其他组件等
  //console.log("存储的分页状态:", currentPagination);

  // 使用 BOOK_CATEGORIES 数组自动生成分类选项
  const categories: Category[] = BOOK_CATEGORIES.map((cat) => ({
    label: cat,
    value: cat,
  }));
  const form = ReactHookForm.useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), //每次表单变化时都会触发zod验证
    defaultValues: {
      title: "",
      author: "",
      category: "",
    },
  });

  // function handleEdit() {
  //   router.push("/books/edit/id1");
  // }
  return (
    <div className="p-4">
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
                      categories={categories}
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
            <Button type="submit">Submit</Button>
          </span>
          <span className="flex items-end">
            <Button
              type="reset"
              onClick={() => {
                form.reset();
              }}
            >
              Clear
            </Button>
          </span>
        </form>
      </Form>

      {/* <Table>
        <TableCaption>the list of our books.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">书名</TableHead>
            <TableHead>作者</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>封面</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>库存</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookExams.map((book) => (
            <TableRow key={book.name}>
              <TableCell className="font-medium">{book.name}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.category}</TableCell>
              <TableCell>
                <Image
                  className="w-15 h-auto"
                  src={`/covers/book${book.id}.jpg`}
                  alt={book.name}
                  width={100}
                  height={100}
                />
              </TableCell>
              <TableCell>{book.description}</TableCell>
              <TableCell>{book.stock}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="link"
                    className="hover:cursor-pointer text-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    className="hover:cursor-pointer text-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table> */}
      <DataformTanstack
        passinData={bookData}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
