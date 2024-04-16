import { DistanceTime } from "@/components/time";
import { Badge } from "@/components/ui/badge";
import request from "@/lib/api/request";
import { Post } from "@/lib/definitions";
import { capitalize } from "@/lib/utils";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import UserCard from "../user-card";
import PostTitle from "./title";

function QuestionStatusBadge({ post }: { post: Post }) {
  return (
    <Badge
      className={clsx("flex justify-center gap-1 text-nowrap border-[1px] bg-inherit px-4 py-1 text-sm md:text-lg", {
        "border-0 bg-ionblue-500 dark:bg-ionblue-500 dark:text-slate-200": post.question.accepting_points > 50,
        "border-black text-black dark:border-gray-100 dark:bg-inherit dark:text-gray-100":
          post.question.accepting_points > 1 && post.question.accepting_points <= 50,
        "border-gray-400 text-gray-400 dark:border-gray-400 dark:bg-inherit dark:text-gray-400":
          post.question.accepting_points == 0,
      })}
    >
      <span>{`${post.question.accepting_points.toLocaleString() ?? 0}eV`}</span>
    </Badge>
  );
}

const PostInfo = ({ post }: { post: Post }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const relatedPage = [
    {
      label: "Q&A",
      href: "/questions/question_free",
    },
    {
      label: post.category.board.label,
      href: `/questions/${post.category.board.name}`,
    },
    {
      label: post.category.label,
      href: `/questions/${post.category.board.name}?category=${post.category.name}`,
    },
  ];

  const mutation = useMutation({
    mutationFn: () => {
      return request.delete(
        `/api/boards/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}/`,
      );
    },
    onSuccess: () => {
      toast.success("게시글이 삭제되었습니다.");
      router.push(`/boards/${post.category.board.name}?category=${post.category.name}`);
    },
    onError: () => {
      toast.error("게시글 삭제에 실패했습니다.");
    },
  });

  const handleClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL이 복사되었습니다.");
  };

  return (
    <div className="flex flex-col gap-3 md:justify-between md:gap-5">
      <div className="flex items-center gap-1 text-sm">
        {relatedPage.map((page, index) => {
          return (
            <div key={index} className="flex items-center gap-1">
              <Link href={page.href}>{page.label}</Link>
              {index !== 2 && <ChevronRightIcon className="size-4" />}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-sm xl:text-base">
        <QuestionStatusBadge post={post} />
        <PostTitle boardLabel={post.category.board.label} postTitle={post.title} />
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <div className="flex items-center gap-2 text-sm xl:text-base">
          <UserCard user={post.user} />
          <Badge variant={`level-${post.user.profile.level}`}>{capitalize(post.user.profile.level)}</Badge>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="flex items-center gap-2">
            <span>답변 {post.comment_count}</span>

            <span className="cursor-pointer hover:text-gray-500 dark:hover:text-gray-300" onClick={handleClipboard}>
              URL 복사
            </span>

            {user && user?.id == post.user.id && (
              <div className="flex gap-2">
                <Link
                  href={`/questions/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}/edit`}
                >
                  수정하기
                </Link>
                {!post.question.accepted_comment && <button onClick={() => mutation.mutate()}>삭제하기</button>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
            <span>조회 {post.hit_count}</span>
            <span>
              <DistanceTime time={post.created_at} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInfo;
