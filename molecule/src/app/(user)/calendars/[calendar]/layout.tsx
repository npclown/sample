import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "일정 캘린더",
  description: "국내 모든 행사 일정을 확인합니다",
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-screen-xl">{children}</div>;
}
