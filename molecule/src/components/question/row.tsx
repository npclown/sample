import { DistanceTime } from "@/components/time";
import UserCard from "@/components/user-card";
import { Post } from "@/lib/definitions";
import clsx from "clsx";
import Link from "next/link";

import { Badge } from "../ui/badge";

function AnswerCountBadge({ post }: { post: Post }) {
  return (
    <Badge
      className={clsx(
        "flex justify-center gap-1 text-nowrap border-[1px] bg-inherit px-2 py-1 text-sm md:px-4 md:py-2 md:text-base",
        {
          "border-0 bg-green-500 dark:bg-green-500 dark:text-slate-200":
            post.comment_count > 0 && post.question?.accepted_comment,
          "border-black text-black dark:border-gray-100 dark:bg-inherit dark:text-gray-100":
            post.comment_count > 0 && !post.question?.accepted_comment,
          "border-gray-400 text-gray-400 dark:border-gray-400 dark:bg-inherit dark:text-gray-400":
            post.comment_count == 0,
        },
      )}
    >
      <span>답변</span>
      <span>{post.comment_count}</span>
    </Badge>
  );
}

function QuestionStatusBadge({ post }: { post: Post }) {
  return (
    <Badge
      className={clsx(
        "flex justify-center gap-1 text-nowrap border-[1px] bg-inherit px-2 py-1 text-sm md:px-4 md:py-2 md:text-base",
        {
          "border-0 bg-ionblue-500 dark:bg-ionblue-500 dark:text-slate-200": post.question.accepting_points >= 50,
          "border-black text-black dark:border-gray-100 dark:bg-inherit dark:text-gray-100":
            post.question.accepting_points > 0 && post.question.accepting_points < 50,
          "border-gray-400 text-gray-400 dark:border-gray-400 dark:bg-inherit dark:text-gray-400":
            post.question.accepting_points == 0,
        },
      )}
    >
      <span>{`${post.question?.accepting_points?.toLocaleString() ?? 0}eV`}</span>
    </Badge>
  );
}

const PostRow = ({ post }: { post: Post }) => {
  return (
    <Link
      href={`/questions/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}`}
      className="flex w-full max-w-full cursor-pointer gap-3 rounded-lg py-4 transition hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <div className="flex flex-col gap-1 font-sans">
        <QuestionStatusBadge post={post} />
        <AnswerCountBadge post={post} />
      </div>

      <div className="flex flex-col justify-center gap-1 truncate">
        <div className="flex flex-col gap-2">
          <div className="flex place-items-center gap-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 md:text-lg xl:text-xl">
              [{post.category.name}]
            </span>
            <span className="truncate text-sm md:text-lg xl:text-xl">{post.title}</span>
            {/* <PhotoIcon className="h-5 w-5" /> */}
          </div>

          <span className="truncate text-xs text-gray-500 dark:text-gray-300 md:text-sm xl:text-base">
            {post.content}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span>[{post.category.board.label}]</span>

          <UserCard type="single" user={post.user} />

          <span>조회{post.hit_count ?? 0}</span>

          <span>
            <DistanceTime time={post.created_at} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PostRow;
export { PostRow };
