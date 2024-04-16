import BoardProvider from "@/components/board/board-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시판",
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BoardProvider>
      <div className="mx-auto max-w-screen-xl">{children}</div>
    </BoardProvider>
  );
}
