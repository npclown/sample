import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 작성",
};

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 p-3">{children}</div>;
}
