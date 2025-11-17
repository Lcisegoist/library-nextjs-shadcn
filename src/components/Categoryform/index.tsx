"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Category } from "@/types";
import { Level_example as CATEGORIES } from "@/app/category/page";
import { CategoryPost, getCategoryList } from "@/apis/category";
const formSchema = z.object({
  name: z.string().min(1, {
    message: "类名不能为空",
  }),
  level: z.string().min(1, {
    message: "级别不能为空",
  }),
  createdAt: z.number(),
  parentCategory: z
    .object({
      id: z.number(),
    })
    .optional(),
});

const CategoryForm = () => {
  //创建类别的level
  const [level, setLevel] = useState(0);
  const [levelOneList, setLevelOneList] = useState<Category[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  //接收form的信息
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdAt: 0,
      name: "",
      level: "",
      parentCategory: undefined,
    },
  });

  //提交表单
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const now = new Date().getTime();
    const data = { ...values, createdAt: now };
    console.log("data:", data);

    setFormData(data);
    const result = await CategoryPost(data);
    console.log("result:", result);
    setOpenDialog(true);
  }

  const handleConfirm = () => {
    // 在这里处理确认后的逻辑

    form.reset();
    setOpenDialog(false);
    router.push("/category");
  };

  useEffect(() => {
    async function getData() {
      const data = await getCategoryList({ all: true, level: 1 });
      setLevelOneList(data);
    }
    getData();
  }, []);

  const levelOneOptions = useMemo(() => {
    return levelOneList.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [levelOneList]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-8 w-[50%] mx-auto mb-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="before:content-['*'] before:text-red-500">
                Category Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="before:content-['*'] before:text-red-500">
                Level
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    console.log("value:", value);
                    setLevel(Number(value));
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.label} value={category.value}>
                        {category.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {level > 1 && (
          <FormField
            control={form.control}
            name="parentCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="before:content-['*'] before:text-red-500">
                  Parent Category
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      console.log("value:", value);
                      field.onChange({
                        id: Number(value),
                      });
                    }}
                    // field.value是zod预先定义的对象结构
                    value={field.value?.id ? String(field.value.id) : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {level == 2 &&
                        levelOneOptions.map((category) => (
                          <SelectItem
                            key={category.label}
                            value={category.value.toString()}
                          >
                            {category.label}
                          </SelectItem>
                        ))}

                      {/* TODO:大于2后面再说吧,毕竟要进行比较选值 */}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提交成功!</AlertDialogTitle>
            <AlertDialogDescription>
              您可以继续添加新的类别信息，或者前往分类列表页查看。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                form.reset();
                setLevel(0);
                setOpenDialog(false);
              }}
            >
              继续添加
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              前往列表
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
};
export default CategoryForm;
