import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 읽기",
};

export default function ViewPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
