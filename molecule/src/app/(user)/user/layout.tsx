import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl">{children}</div>;
}
