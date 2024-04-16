import BoardFormDialog from "@/components/admin/board/form-dialog";
import BoardList from "@/components/admin/board/list";
import { Header, HeaderActions, HeaderTitle } from "@/components/admin/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시판 목록",
  description: "게시판 목록을 확인합니다",
};

export default async function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>{metadata.title?.toString()}</HeaderTitle>

        <HeaderActions>
          <BoardFormDialog />
        </HeaderActions>
      </Header>

      <BoardList />
    </>
  );
}
