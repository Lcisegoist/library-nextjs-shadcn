"use client";
import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "图书管理",
      url: "books",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "图书列表",
          url: "books",
        },
        {
          title: "图书添加",
          url: "books/add",
        },
      ],
    },
    {
      title: "借阅管理",
      url: "borrows",
      icon: Bot,
      items: [
        {
          title: "借阅列表",
          url: "borrows",
        },
        {
          title: "书籍借阅",
          url: "borrows/add",
        },
      ],
    },
    {
      title: "分类管理",
      url: "categories",
      icon: BookOpen,
      items: [
        {
          title: "分类列表",
          url: "categories/list",
        },
        {
          title: "分类添加",
          url: "categories/add",
        },
      ],
    },
    {
      title: "用户管理",
      url: "users",
      icon: Settings2,
      items: [
        {
          title: "用户列表",
          url: "users/list",
        },
        {
          title: "用户添加",
          url: "users/add",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

//侧边栏完整结构
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>

      {/* <TeamSwitcher teams={data.teams} /> */}
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
