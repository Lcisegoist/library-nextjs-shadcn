export interface User {
  id: string;
  name: string;
  role: string;
  status: "active" | "inactive"
  nickName: string
}