export interface User {
  id: number | string;
  email: string;
  nickname: string;
  points: Point;
  profile: Profile;
  created_at: Date;
  last_active_at: Date;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
}

export interface Point {
  point: number;
}

export type Level = "novice" | "pro" | "elite" | "moderator";

export interface Profile {
  introduction: string;
  affiliation: string;
  school: string;
  level: Level;
  image_url: string;
  location: string;
}

export interface Board extends Permissionable {
  id: string;
  name: string;
  label: string;
  description: string;
  type: "post" | "question";
  order: number;
  is_main: boolean;
  posts?: Post[];
}

export interface BoardPoint {
  write_point: number;
  like_point: number;
  like_count: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: Date;
  board: Board;
  user: User;
  comment_count: number;
  like_count: number;
  hit_count: number;
}

export interface PointHistory {
  id: string;
  email: string;
  amount: number;
  description: string;
  created_at: Date;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  like_count: number;
  created_at: Date;
}

export interface ParsedError {
  message: string;
}

export type SearchRange = "all" | "title" | "content" | "nickname";

export interface Permissionable {
  id: string;
  name?: string;
  label: string;
}

export interface PermissionableModel {
  id: "board";
  label: string;
}
export type PermissionValueType = "BOOLEAN" | "INTEGER";

export interface Role {
  id: string;
  name: string;
  description: string;
  level: "novice" | "pro" | "elite" | "legendary" | "moderator";
}

export interface Permission {
  id: string;
  name: string;
  value_type: PermissionValueType;
  permission_object: {
    model: PermissionableModel;
    object: Permissionable;
  };
}

export interface Navigation {
  id: string;
  label: string;
  link: string;
  description: string;
  order: number;
}

export interface Banner {
  id: string;
  image_url: string;
  title: string;
  description: string;
  order: number;
}

export interface RoleUser {
  id: string;
  user: User;
  role: Role;
}

export interface RolePermission {
  id: string;
  role: Role;
  permission: Permission;
  value: number;
}

export interface Calendar {
  id: string;
  name: string;
  label: string;
  description: string;
  order: number;
}

export interface Recruit {
  headcount: number;
  point: number;
  note: string;
}

export interface Event {
  id: string;
  calendar: Calendar;
  user: User;
  start: Date;
  end: Date;
  title: string;
  description: string;
  color: string;
  status: string;
  recruit: Recruit;
  price: number;
  is_team: boolean;
  is_online: boolean;
  owner?: boolean;
  created_at: Date;
}

export interface BoardCategory {
  id: string;
  board: Board;
  name: string;
  label: string;
  description: string;
  order: number;
  category_point: BoardCategoryPoint;
}

export interface BoardCategoryPoint {
  write_point: string;
  like_point: string;
  like_count: string;
}
