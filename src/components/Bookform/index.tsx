"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Book, BOOK_CATEGORIES } from "@/types/book";
import DatePicker from "@/components/ui/DatePicker";
import { BookPost } from "@/apis/book";
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
const formSchema = z.object({
  name: z.string().min(1, {
    message: "书名不能为空",
  }),
  author: z.string().min(1, {
    message: "作者不能为空",
  }),

  category: z.string().min(1, {
    message: "分类不能为空",
  }),
  cover: z.string().min(1),
  publishedAt: z.date(),
  stock: z.number().min(0),
  description: z.string().min(1),
});

const BookForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [previewCover, setPreviewCover] = useState<string | null>(null);

  //接收form的信息
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      author: "",
      category: "",
      cover: "",
      publishedAt: undefined,
      stock: 0,
      description: "",
    },
  });

  //提交表单
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormData(values);
    // 将 Date 对象转换为 number（时间戳，单位：秒）
    const bookData: Book = {
      ...values,
      publishedAt: values.publishedAt
        ? Math.floor(values.publishedAt.getTime() / 1000)
        : 0,
    };
    console.log("bookData:", bookData);
    await BookPost(bookData);
    setOpenDialog(true);
    setPreviewCover(null);
  }

  const handleConfirm = () => {
    // 在这里处理确认后的逻辑
    console.log("Confirmed data:", formData);
    form.reset();
    setPreviewCover(null);
    setOpenDialog(false);
    router.push("/books");
  };

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
              <FormLabel>Book Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Enter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem key="other" value="other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter"
                    value={field.value as string}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log("field.value:", field.value);
                      setPreviewCover(field.value);
                    }}
                  >
                    预览
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {previewCover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewCover}
            alt="Cover preview"
            width={313}
            height={180}
          />
        )}
        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published At</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-fit"
                  placeholder="Enter"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description..."
                  className="min-h-20"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提交成功!</AlertDialogTitle>
            <AlertDialogDescription>
              您可以继续添加新的书籍信息，或者前往书籍列表页查看。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                form.reset();
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
export default BookForm;
