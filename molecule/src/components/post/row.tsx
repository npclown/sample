import { DistanceTime } from "@/components/time";
import UserCard from "@/components/user-card";
import { Post } from "@/lib/definitions";
import { ChatBubbleBottomCenterTextIcon, HandThumbUpIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { Badge } from "../ui/badge";

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-1 flex items-center gap-1 truncate text-lg">
      <span className="truncate text-xs md:text-sm">{children}</span>
      {/* <PhotoIcon className="h-4 w-4" /> */}
    </div>
  );
}

const MainRow = ({ post, rank = false }: { post: Post; rank?: boolean }) => {
  return (
    <Link
      href={`/boards/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}`}
      className="flex w-full cursor-pointer items-center justify-between truncate py-1 transition hover:text-gray-500"
    >
      <div className="flex items-center gap-1 truncate">
        {rank && <Badge className="h-5 w-12 bg-red-400 text-white dark:bg-red-500 dark:text-white">HOT</Badge>}

        <Title>{post.title}</Title>
      </div>

      <div className="font-sans text-xs font-bold text-gray-500">
        <span>
          <DistanceTime time={post.created_at} />
        </span>
      </div>
    </Link>
  );
};

const PostRow = ({ post }: { post: Post }) => {
  return (
    <Link
      href={`/boards/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}`}
      className="flex w-full justify-between px-2 py-3 text-base transition hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <div className="flex flex-1 gap-3">
        <span>[{post.category.board.label}]</span>

        <div className="flex flex-1 items-center gap-1 truncate md:w-52 xl:w-96">
          <span className="text-gray-500 dark:text-gray-400">[{post.category.label}]</span>
          <span className="truncate">{post.title}</span>
          {/* <PhotoIcon className="h-4 w-4" /> */}

          {post.comment_count > 0 ? (
            <span className="text-gray-500 dark:text-gray-400">[{post.comment_count}]</span>
          ) : null}
        </div>
      </div>

      <div className="flex w-full max-w-sm justify-between">
        <div className="flex flex-1 justify-center">
          <UserCard type="single" user={post.user} />
        </div>

        <div className="flex w-full max-w-[260px] items-center justify-between">
          <div className="flex flex-1 justify-center text-center">
            <span>{post.like_count ?? 0}</span>
          </div>
          <div className="flex flex-1 justify-center text-center">
            <span>{post.hit_count ?? 0}</span>
          </div>
          <div className="flex flex-1 justify-center text-center text-sm">
            <span>
              <DistanceTime time={post.created_at} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MobilePostRow = ({ post }: { post: Post }) => {
  return (
    <Link
      href={`/boards/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}`}
      className="border-t-1 border-b-1 flex w-full flex-col justify-between gap-3 border border-y-gray-600 px-2 py-3 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <div className="flex gap-1">
        <span>{post.category.board.label}게시판</span>

        <div className="flex items-center gap-1">
          <span className="rounded-sm bg-ionblue-500 px-3 text-xs text-slate-100 dark:bg-gray-600 dark:text-slate-200">
            {post.category.label}
          </span>
          {/* <PhotoIcon className="h-4 w-4" /> */}

          {post.comment_count > 0 ? (
            <span className="text-gray-500 dark:text-gray-400">[{post.comment_count}]</span>
          ) : null}
        </div>
      </div>

      <span className="truncate">{post.title}</span>

      <div className="flex w-full justify-between text-xs">
        <UserCard type="single" user={post.user} />

        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <span>추천 {post.like_count ?? 0}</span>
          <span>조회 {post.hit_count ?? 0}</span>
          <DistanceTime time={post.created_at} />
        </div>
      </div>
    </Link>
  );
};

export default PostRow;
export { PostRow, MainRow, MobilePostRow };
