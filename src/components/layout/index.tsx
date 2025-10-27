import { AppSidebar } from "@/components/app-sidebar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      {/* 独立的顶部栏 */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 z-50">
        <div className="flex items-center gap-3">
          <Image
            src="/favicon.ico"
            alt="logo"
            width={32}
            height={32}
            className="rounded"
          />
          <h1 className="text-lg font-semibold">图书管理系统</h1>
        </div>

        <div className="flex items-center">
          <DropdownMenu triggerMode="hover">
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <span>登录</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>注册</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 右侧面包屑导航 */}
        {/* <div className="ml-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div> */}
      </header>

      {/* 主体内容区域 - 侧边栏 + 主内容 */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            {/* 侧边栏切换按钮区域 */}
            <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>切换侧边栏</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>

            {/* 主要内容区域 */}
            <div className="flex-1 p-4 bg-slate-100 overflow-auto">
              <div className="pl-2  bg-white rounded-lg min-h-full overflow-auto">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};
export default Layout;
