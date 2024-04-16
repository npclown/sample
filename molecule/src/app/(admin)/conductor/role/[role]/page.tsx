import { Header, HeaderTitle } from "@/components/admin/header";
import RoleForm from "@/components/admin/role/form";
import RolePermission from "@/components/admin/role/permission";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "역할 관리",
  description: "역할을 관리합니다",
};

export default async function Page({ params }: { params: { role: string } }) {
  return (
    <div className="mx-auto max-w-6xl">
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>
      </Header>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full max-w-xl">
          <RoleForm mode="edit" roleId={params.role} />
        </div>

        <div className="w-full max-w-xl">
          <RolePermission roleId={params.role} />
        </div>
      </div>
    </div>
  );
}
