import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "랭킹",
};

export default function RankLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full flex-col gap-4">{children}</div>;
}
