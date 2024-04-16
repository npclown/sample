import { Header, HeaderTitle } from "@/components/admin/header";
import UserInfo from "@/components/admin/user/info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원 관리",
  description: "회원을 관리합니다",
};

export default async function Page({ params }: { params: { user: number } }) {
  return (
    <div className="mx-auto max-w-xl">
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>
      </Header>

      <div>
        <UserInfo userId={params.user} />
      </div>
    </div>
  );
}
