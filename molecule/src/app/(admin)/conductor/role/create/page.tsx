import { Header, HeaderTitle } from "@/components/admin/header";
import RoleForm from "@/components/admin/role/form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "역할 생성",
  description: "역할을 생성합니다",
};

export default async function Page() {
  return (
    <div className="mx-auto max-w-xl">
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>
      </Header>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full max-w-xl">
          <RoleForm mode="create" />
        </div>
      </div>
    </div>
  );
}
