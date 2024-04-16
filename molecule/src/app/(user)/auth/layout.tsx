import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg bg-white px-4 py-8 shadow-md dark:bg-gray-700 md:px-16 md:py-12 lg:rounded-lg">
      {children}
    </div>
  );
}
