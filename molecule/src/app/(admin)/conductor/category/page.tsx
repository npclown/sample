import BoardCategoryFormDialog from "@/components/admin/category/form-dialog";
import BoardCategoryList from "@/components/admin/category/list";
import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "카테고리 목록",
  description: "카테고리 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions>
          <BoardCategoryFormDialog />
        </HeaderActions>
      </Header>

      <BoardCategoryList />
    </>
  );
}
