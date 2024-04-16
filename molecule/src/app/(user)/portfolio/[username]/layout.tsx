import PortfolioNavbar from "@/components/navbar/portfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포트폴리오 리스트",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortfolioNavbar />
      <div className="mx-auto flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700 xl:relative xl:z-10 xl:p-5">
        {children}
      </div>
    </>
  );
}
