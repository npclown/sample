import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ION | 이용준칙",
};

export default function RulesLayout({ children, params }: { children: React.ReactNode; params: { board: string } }) {
  return <div className="mx-auto flex w-full flex-col gap-4">{children}</div>;
}
