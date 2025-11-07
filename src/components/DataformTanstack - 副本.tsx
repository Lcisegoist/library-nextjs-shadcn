"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  CellContext,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import Image from "next/image";
import { Book, DataformProps, Category } from "@/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/apis/book";
import { deleteCategory } from "@/apis/category";
import { toast } from "sonner";
// 根据传入的passinData类型定义列
function isBook(data: Book[] | Category[]): data is Book[] {
  if (data.length === 0) return false;
  return "cover" in data[0];
}
function isCategory(data: Book[] | Category[]): data is Category[] {
  if (data.length === 0) return false;
  return "level" in data[0];
}

const DataformTanstack = ({
  passinData,
  onPaginationChange,
  onDeleteSuccess,
}: DataformProps) => {
  const router = useRouter();
  console.log("passinData:", passinData);

  //判断传入的数据是什么类型，确定表格的列
  const isBookData = isBook(passinData);
  const isCategoryData = isCategory(passinData);
  console.log("isBookData:", isBookData);
  console.log("isCategoryData:", isCategoryData);

  // 种类删除弹窗状态
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  //存储待删除的种类
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);

  //定义编辑删除函数
  const onBookEdit = React.useCallback(
    (item: Book) => {
      console.log("onBookEdit:", item);
      router.push(`/books/edit/${item.id}`);
    },
    [router]
  );

  const onBookDelete = React.useCallback((item: Book) => {
    console.log("onBookDelete:", item);
    deleteBook(item.id.toString());
  }, []);

  const onCategoryEdit = React.useCallback(
    (item: Category) => {
      console.log("onCategoryEdit:", item);
      router.push(`/category/edit/${item.id}`);
    },
    [router]
  );

  const onCategoryDelete = React.useCallback((item: Category) => {
    console.log("onCategoryDelete:", item);
    setCategoryToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  // 确认删除种类
  const handleConfirmDelete = React.useCallback(async () => {
    if (categoryToDelete) {
      console.log("categoryToDelete:", categoryToDelete);
      try {
        await deleteCategory(categoryToDelete.id.toString());
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        // 删除成功后调用回调，刷新数据
        onDeleteSuccess?.();
      } catch (error) {
        console.error("删除失败:", error);
        toast.error("删除失败");
      }
    }
  }, [categoryToDelete, onDeleteSuccess]);
  const columns = React.useMemo(() => {
    if (isBookData) {
      return [
        {
          accessorKey: "createdAt",
          header: "Created At",
          cell: (info: CellContext<Book | Category, unknown>) => {
            const date = new Date((info.getValue() as number) * 1000);
            return date.toLocaleString();
          },
        },
        {
          accessorKey: "id",
          header: "ID",
        },
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "author",
          header: "Author",
        },
        {
          accessorKey: "category",
          header: "Category",
        },
        {
          accessorKey: "cover",
          header: "Cover",
          cell: (info: CellContext<Book | Category, unknown>) => {
            const value = info.getValue() as string;
            return (
              <Image
                src={value}
                alt={`book cover`}
                width={50}
                height={50}
                className="object-cover"
              />
            );
          },
        },
        {
          accessorKey: "description",
          header: "Description",
          cell: (info: CellContext<Book | Category, unknown>) => {
            const text = (info.getValue() as string) || "";
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                    {text}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-50 text-center">{text}</p>
                </TooltipContent>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "stock",
          header: "Stock",
        },
        // 删除编辑操作
        {
          id: "actions",
          header: "操作",
          cell: (info: CellContext<Book | Category, unknown>) => {
            const row = info.row.original as Book;
            return (
              <>
                {onBookEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBookEdit(row)}
                        className="h-4 w-4 !p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">编辑</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>编辑</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onBookDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBookDelete(row)}
                        className="h-4 w-4 !p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">删除</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>删除</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            );
          },
        },
      ];
    } else if (isCategoryData) {
      return [
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "level",
          header: "Level",
          cell: (info: CellContext<Book | Category, unknown>) => {
            const value = info.getValue() as string;
            return (
              <Badge className={value == "1" ? "bg-green-500" : "bg-blue-500"}>
                Level {value}
              </Badge>
            );
          },
        },
        {
          accessorKey: "parent",
          header: "Belonging Category",
          cell: (info: CellContext<Book | Category, unknown>) => {
            const value = info.getValue() as Category;
            return <Badge className="bg-gray-400">{value.name}</Badge>;
          },
        },
        {
          accessorKey: "createdAt",
          header: "Created At",
        },
        {
          id: "actions",
          header: "操作",
          cell: (info: CellContext<Book | Category, unknown>) => {
            const row = info.row.original as Category;
            return (
              <div className="flex items-center gap-2">
                {onCategoryEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCategoryEdit(row)}
                        className="h-4 w-4 !p-0 hover:cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">编辑</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>编辑</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onCategoryDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCategoryDelete(row)}
                        className="h-4 w-4 !p-0 text-destructive hover:text-destructive hover:cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">删除</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>删除</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            );
          },
        },
      ];
    }
    // 默認返回空數組，避免 undefined 導致錯誤
    return [];
  }, [
    isBookData,
    isCategoryData,
    onBookEdit,
    onBookDelete,
    onCategoryEdit,
    onCategoryDelete,
  ]);
  console.log("columns:", columns);
  // 状态管理
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [jumpPage, setJumpPage] = React.useState("");

  // 创建表格实例
  const table = useReactTable({
    data: passinData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // 当分页状态改变时，通知父组件
    onPaginationChange: (updater) => {
      //next:{pageIndex: 0, pageSize: 10}
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      console.log("next:", next);

      setPagination(next);
      onPaginationChange?.(next);
    },
    state: {
      pagination,
    },
  });

  // 跳转页面处理
  const handleJumpPage = () => {
    const page = parseInt(jumpPage);
    if (!isNaN(page) && page > 0 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1);
      setJumpPage("");
    }
  };

  return (
    <div className="w-full mt-7">
      {/* 种类删除确认弹窗 */}
      {isCategoryData && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除？</AlertDialogTitle>
              <AlertDialogDescription>
                你确定要删除 &quot;{categoryToDelete?.name}&quot;
                吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await handleConfirmDelete();
                  toast.success("删除成功");
                }}
              >
                确认
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* 表格 */}
      <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<Book | Category>) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<Book | Category, unknown>) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )
                  )}
                </tr>
              ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.map((row: Row<Book | Category>, index: number) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<Book | Category, unknown>) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-900 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 分页控制 */}
      <div className="sticky bottom-0 flex items-center justify-between mt-4 gap-4">
        {/* 左侧：每页大小选择 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">每页显示</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} 条
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 中间：页面信息 */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>
            第 {pagination.pageIndex + 1} 页，共 {table.getPageCount()} 页
          </span>
          <span className="text-gray-500">(总计 {passinData.length} 条)</span>
        </div>

        {/* 右侧：分页按钮和跳转 */}
        <div className="flex items-center gap-2">
          {/* 首页 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            首页
          </Button>

          {/* 上一页 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>

          {/* 下一页 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>

          {/* 末页 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            末页
          </Button>

          {/* 跳转到指定页 */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-700">跳转至</span>
            <Input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJumpPage();
                }
              }}
              className="w-18 h-8"
              placeholder="页码"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleJumpPage}
              disabled={!jumpPage}
            >
              跳转
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataformTanstack;
