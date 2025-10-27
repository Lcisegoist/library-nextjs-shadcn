import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";
import Image from "next/image";
import { Book, DataformProps } from "@/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// 注册模块
ModuleRegistry.registerModules([AllCommunityModule]);

// const categoryFilterParams = {
//   comparator:(a,b) =>{

//   }
// }
const defaultColDef = {
  flex: 1, // 所有列平分剩余宽度
  minWidth: 100, // 每列最小宽度
  resizable: true, // 用户可拖动调整
};

const Dataform = ({ passinData }: DataformProps) => {
  console.log("bookDataindefine:", passinData);
  const [colDefs] = React.useState<ColDef<Book>[]>([
    {
      field: "createdAt",
      headerName: "Created At",
      sortable: false,
      cellStyle: { display: "flex", alignItems: "center" },
      cellRenderer: (params: ICellRendererParams) => {
        const date = new Date(params.value * 1000);
        console.log(params);
        return date.toLocaleString(); // 例如：2023/10/27 08:00:00
      },
    },
    {
      field: "id",
      sortable: false,
      cellStyle: { display: "flex", alignItems: "center" },
    },
    {
      field: "name",
      sortable: false,
      cellStyle: { display: "flex", alignItems: "center" },
    },
    {
      field: "author",
      sortable: false,
      cellStyle: { display: "flex", alignItems: "center" },
    },
    {
      field: "category",
      sortable: false,
      cellStyle: { display: "flex", alignItems: "center" },
    },
    {
      field: "cover",
      autoHeight: true,
      sortable: false,

      cellRenderer: (params: ICellRendererParams) => {
        return (
          <Image
            src={params.value}
            alt={`book not found: ${params.value}`}
            width={50}
            height={50}
          />
        );
      },
    },
    {
      field: "description",
      sortable: false,
      wrapText: false, //不换行
      cellStyle: {
        display: "flex",
        alignItems: "center",
        overflow: "hidden",

        whiteSpace: "nowrap",
      },
      cellRenderer: (params: ICellRendererParams) => {
        const text = params.value || "";
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {text}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{text}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      // cellRenderer: (params: ICellRendererParams) => {
      //   const text = params.value || "";

      //   // 获取列实际宽度
      //   const cellWidth = params.column!.getActualWidth();
      //   const padding = 20; // 左右 padding
      //   const availableWidth = cellWidth - padding;

      //   //  创建 canvas 测量文字宽度
      //   const canvas = document.createElement("canvas");
      //   const ctx = canvas.getContext("2d")!;
      //   ctx.font = "14px IBM Plex Sans"; // 必须和表格单元格字体一致
      //   const textWidth = ctx.measureText(text).width;

      //   // 如果文字宽度超出可用宽度，则截断
      //   let displayText = text;
      //   if (textWidth > availableWidth) {
      //     let fittedText = "";
      //     let widthAccum = 0;

      //     for (let i = 0; i < text.length; i++) {
      //       const charWidth = ctx.measureText(text[i]).width;
      //       if (
      //         widthAccum + charWidth >
      //         availableWidth - ctx.measureText("...").width
      //       )
      //         break;
      //       fittedText += text[i];
      //       widthAccum += charWidth;
      //     }

      //     displayText = fittedText + "...";
      //   }

      //   return (
      //     <span title={text} style={{ cursor: "pointer" }}>
      //       {displayText}
      //     </span>
      //   );
      // },
    },
    { field: "stock", cellStyle: { display: "flex", alignItems: "center" } },
  ]);

  return (
    <div className="ag-theme-quartz w-full h-[550px] mt-7">
      <AgGridReact<Book>
        rowData={passinData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        getRowStyle={(params) => {
          // 可以根据条件返回不同的样式
          if (params.node.rowIndex! % 2 === 0) {
            return { backgroundColor: "#f8f9fa" }; // 偶数行背景色
          }
          return { backgroundColor: "#ffffff" }; // 奇数行背景色
        }}
        // 或者使用 getRowClass 添加 CSS 类
        // getRowClass={(params) => {
        //   return params.node.rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
        // }}
      />
    </div>
  );
};

export default Dataform;
