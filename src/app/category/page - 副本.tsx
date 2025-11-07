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
import Content from "@/components/Content";
import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as ReactHookForm from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import { getCategoryList } from "@/apis/category";
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

import { Category, PaginationState } from "@/types";
import SelectSearch from "@/components/ui/SelectSearch";

const formSchema = z.object({
  name: z.string().optional(),
  level: z.string().optional(),
});
const Level_example = [
  { label: "Level 1", value: "1" },
  { label: "Level 2", value: "2" },
  { label: "Level 3", value: "3" },
];

//categoryform的格式
// export function Categoryform() {
//   const form = ReactHookForm.useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema), // zod + react-hook-form 联动
//     //mode: "onChange", 设置触发zod验证的时机
//     defaultValues: {
//       name: "",
//       level: "",
//     },
//   });

//   return form;
// }

export default function Categorys() {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  //存储分页情况
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const form = ReactHookForm.useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), //每次表单变化时都会触发zod验证
    defaultValues: {
      name: "",
      level: "",
    },
  });

  // 统一的获取数据函数，带上表单和分页信息
  // 注意：不将 form 作为依赖，因为 form.getValues() 是方法调用，总是能获取最新值

  // 初始加载和分页变化时获取数据
  useEffect(() => {
    console.log("refreshed:");
    async function fetchBooklist() {
      try {
        const data = await getCategoryList();
        setCategoryData(data);
      } catch (error) {
        console.error("获取书籍列表失败:", error);
      }
    }
    fetchBooklist();
  }, []);

  //搜索
  const onSubmit1 = useCallback(async (values: z.infer<typeof formSchema>) => {
    console.log("category values:", values);
    // 点击搜索时，自动回到第一页
    setCurrentPagination((prev) => ({ ...prev, pageIndex: 0 }));
    // 注意：分页变化会触发 fetchCategorylist，所以这里不需要手动调用
  }, []);

  //分页变化（由 DataformTanstack 调用）
  const handlePaginationChange = useCallback((pagination: PaginationState) => {
    setCurrentPagination(pagination);
  }, []);

  //删除后刷新
  // const handleDeleteSuccess = useCallback(() => {
  //   fetchCategorylist();
  // }, [fetchCategorylist]);

  //当分页变化时自动请求
  // useEffect(() => {
  //   fetchCategorylist();
  // }, [currentPagination, fetchCategorylist]);

  // function handleEdit() {
  //   router.push("/books/edit/id1");
  // }
  console.log("categories:", Level_example);
  return (
    <Content title="分类列表" url="/category/add">
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit1)} //提交时触发验证
            className="flex flex-row gap-12"
          >
            <div className="w-52">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <SelectSearch
                        label="level"
                        categories={Level_example}
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
          passinData={categoryData}
          onPaginationChange={handlePaginationChange}
          // onDeleteSuccess={handleDeleteSuccess}
        />
      </>
    </Content>
  );
}
