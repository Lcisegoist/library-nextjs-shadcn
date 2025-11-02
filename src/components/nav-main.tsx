"use client";
import { useMemo } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  // 在組件頂層調用 usePathname，只調用一次
  const pathname = usePathname();

  // 使用 useMemo 緩存計算結果，只在 pathname 或 items 變化時重新計算
  // 只處理第二級目錄，為第二級子項目添加 isPathActive 屬性
  const itemsWithActiveState = useMemo(() => {
    return items.map((item) => {
      const updatedItems = item.items?.map((subitem) => {
        if (pathname === `/${subitem.url}`) {
          return {
            ...subitem,
            isPathActive: true,
          };
        }
        return { ...subitem, isPathActive: false };
      });
      return {
        ...item,
        items: updatedItems,
      };
    });
  }, [items, pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {itemsWithActiveState.map((item) => {
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            subItem.isPathActive &&
                              "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                        >
                          <Link href={`/${subItem.url}`}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
