import BoardList from "@/components/board/board-list";
import BoardWriteButton from "@/components/board/board-write-button";
import Search from "@/components/board/search";
import PostList from "@/components/post/list";
import PopularPost from "@/components/post/popular";

export default function Page({ params }: { params: { board: string } }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-3 dark:bg-gray-800 md:gap-8 md:px-10 md:py-8 xl:px-32 xl:py-12 xl:shadow-md xl:dark:bg-gray-700">
      <BoardList boardName={params.board} />
      <PopularPost />
      <PostList />
      <BoardWriteButton />
      <Search />
    </div>
  );
}
