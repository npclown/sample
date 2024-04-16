import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/user/sidebar-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "계정 관리",
  description: "내 계정을 관리합니다.",
};

const sidebarNavItems = [
  {
    title: "프로필 설정",
    href: "/user/setting",
  },
  {
    title: "계정 설정",
    href: "/user/setting/account",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="space-y-6 rounded-lg bg-background p-4 py-8 shadow-md dark:bg-gray-700 md:p-8 md:pb-16">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">계정 관리</h2>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
