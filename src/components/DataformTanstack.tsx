"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  CellContext,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import Image from "next/image";
import { Book, DataformProps } from "@/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DataformTanstack = ({
  passinData,
  onPaginationChange,
}: DataformProps) => {
  // 定义列
  const columns = React.useMemo<ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info: CellContext<Book, unknown>) => {
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
        cell: (info: CellContext<Book, unknown>) => {
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
        cell: (info: CellContext<Book, unknown>) => {
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
    ],
    []
  );

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
      {/* 表格 */}
      <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Book>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<Book, unknown>) => (
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
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row: Row<Book>, index: number) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {row.getVisibleCells().map((cell: Cell<Book, unknown>) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-900 align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
              className="w-16 h-8"
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
