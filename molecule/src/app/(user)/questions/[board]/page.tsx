import BoardList from "@/components/board/question/board-list";
import Search from "@/components/board/search";
import PostList from "@/components/question/list";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default function Page({ params }: { params: { board: string } }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-3 shadow-md dark:bg-gray-800 md:gap-8 md:px-10 md:py-8 xl:px-32 xl:py-12 xl:dark:bg-gray-700">
      <BoardList boardName={params.board} />
      <PostList />
      <div className="flex items-end justify-end">
        <Button asChild className="h-7 bg-ionblue-500 px-5 text-xs dark:bg-gray-300 md:h-8 md:text-base">
          <Link href={`/questions/${params.board}/create`} className="flex items-center gap-1">
            <PencilIcon className="size-3 md:size-4" />
            <span>질문 작성</span>
          </Link>
        </Button>
      </div>
      <Search />
    </div>
  );
}
