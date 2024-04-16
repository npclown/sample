import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 수정",
};

export default function EditPostLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 p-3">{children}</div>;
}
