# 类型定义说明

## 文件结构

```
src/types/
├── index.ts          # 总览导出文件
├── book.ts           # 图书相关类型定义
└── README.md         # 说明文档
```

## 使用方法

### 1. 导入类型

```typescript
// 从总览文件导入（推荐）
import { Book, BookFormData, Category } from "@/types";

// 或者从具体文件导入
import { Book } from "@/types/book";
```

### 2. 类型说明

- **Book**: 图书实体类型，包含 id、name、author、category、cover、description、stock 字段
- **BookFormData**: 图书表单数据类型，用于表单验证
- **Category**: 分类选项类型，包含 label 和 value 字段
- **BookCategory**: 图书分类枚举类型

### 3. 在组件中使用

```typescript
// 在 Dataform.tsx 中
import { Book } from "@/types";

interface DataformProps {
  passinData: Book[];
}

// 在 page.tsx 中
import { Book, Category } from "@/types";

const [bookData, setBookData] = useState<Book[]>([]);
const categories: Category[] = [
  { label: "Novel", value: "Novel" },
  // ...
];
```

## 扩展

如需添加新的类型定义：

1. 在 `types/` 文件夹中创建新的 `.ts` 文件
2. 在 `types/index.ts` 中添加导出
3. 在需要的地方导入使用
