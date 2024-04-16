export interface User {
  id: string;
  email: string;
  nickname: string;
  points: Point;
  profile: Profile;
  is_email_verified: boolean;
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
  profile_url: string;
}

export interface Category {
  name: string;
  label: string;
  description: string;
  order: number;
  board: Board;
  posts?: Post[];
}

export interface Board {
  name: string;
  label: string;
  description: string;
  type: "post" | "question";
  order: number;
  categories?: Category[];
}

export interface Question {
  accepting_points: number;
  accepted_at: Date;
  accepted_comment: Comment | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: Date;
  user: User;
  category: Category;
  question: Question;
  comment_count: number;
  like_count: number;
  hit_count: number;
  liked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  like_count: number;
  created_at: Date;
  comments: Comment[];
  liked: boolean;
}

export interface ParsedError {
  message: string;
}

export type SearchRange = "all" | "title" | "content" | "nickname";

export interface AchievementType {
  id: string;
  title: string;
  desc: string;
  img: string;
}
export interface Notification {
  id: string;
  label: string;
  content: string;
  link: string;
  created_at: Date;
  read_at: Date;
}

export interface AwardType {
  id: string;
  type: string;
  agency: string;
  description: string;
  date: Date | string;
}

export interface Navigation {
  id: string;
  label: string;
  link: string;
  description: string;
  order: number;
}

export interface Attendance {
  user: User;
  attended_date: Date | string;
  attended_time: Date | string;
}

export interface Pagination<T> {
  count: number;
  data: T[];
  links: {
    next: string | null;
    previous: string | null;
  };
  status: "success" | "error";
}

export interface Banner {
  id: string;
  image_url: string;
  title: string;
  description: string;
  order: number;
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
  status: string;
  note: string;
  count?: number;
  accept_count?: number;
  applicant_status?: string;
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

export interface Applicant {
  id: string;
  user: User;
  event: Event;
  status: string;
  created_at: Date;
}

export interface Skill {
  id: string;
  name: string;
  using_count: number;
  skill_id?: string;
  checked?: boolean;
}

export interface Issue {
  id: string;
  board: Board;
  title: string;
  link: string;
}

export interface CustomAxiosError extends Error {
  response: {
    data: {
      data: {
        non_field_errors: string[];
        message: string;
      };
    };
  };
}
