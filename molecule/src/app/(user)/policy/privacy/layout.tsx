import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ION | 개인정보처리방침",
};

export default function PrivacyLayout({ children, params }: { children: React.ReactNode; params: { board: string } }) {
  return <div className="mx-auto flex w-full flex-col gap-4">{children}</div>;
}
