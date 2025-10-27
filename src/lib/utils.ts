import { clsx, type ClassValue } from "clsx" //用于条件性构建 CSS 类名的库
import { twMerge } from "tailwind-merge" //tailwindcss类名合并库

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
