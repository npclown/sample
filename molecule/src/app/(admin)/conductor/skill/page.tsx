import BoardCategoryFormDialog from "@/components/admin/category/form-dialog";
import BoardCategoryList from "@/components/admin/category/list";
import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import SkillFormDialog from "@/components/admin/skill/form-dialog";
import SkillList from "@/components/admin/skill/list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "스킬 목록",
  description: "스킬 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions>
          <SkillFormDialog />
        </HeaderActions>
      </Header>

      <SkillList />
    </>
  );
}
