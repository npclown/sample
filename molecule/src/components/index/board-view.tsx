import { Post as PostType } from "@/lib/definitions";
import { usePostList } from "@/store/queries/board/post/list";

import { MainRow } from "../post/row";
import { Board, BoardSkeleton } from "./board";

const BoardView = ({
  boardName,
  title,
  buttonText,
  isRank = false,
}: {
  boardName: string;
  title: string;
  buttonText: string;
  isRank?: boolean;
}) => {
  const { isLoading, data: posts } = usePostList(boardName, 1, "all", "", "", "", "");

  if (isLoading) {
    return <BoardSkeleton></BoardSkeleton>;
  }

  return (
    <Board board={title} buttonText={buttonText}>
      {posts &&
        posts.posts.slice(0, 10).map((post: PostType) => <MainRow post={post} rank={isRank} key={post.id}></MainRow>)}
      {(posts?.posts.length ?? 0) == 0 && <div>게시글이 존재하지 않습니다.</div>}
      <div>게시글이 존재하지 않습니다</div>
    </Board>
  );
};

export default BoardView;
