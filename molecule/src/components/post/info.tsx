import { DistanceTime } from "@/components/time";
import { Badge } from "@/components/ui/badge";
import request from "@/lib/api/request";
import { Post } from "@/lib/definitions";
import { capitalize, nextLevel, nextLevelPoint } from "@/lib/utils";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import UserCard from "../user-card";
import PostTitle from "./title";

const PostInfo = ({ post }: { post: Post }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const relatedPage = [
    {
      label: "커뮤니티",
      href: "/boards/free",
    },
    {
      label: post.category.board.label,
      href: `/boards/${post.category.board.name}`,
    },
    {
      label: post.category.label,
      href: `/boards/${post.category.board.name}?category=${post.category.name}`,
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

      <PostTitle boardLabel={post.category.board.label} postTitle={post.title} />

      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <div className="flex items-center gap-2 text-sm xl:text-base">
          <UserCard user={post.user} />
          <Badge variant={`level-${post.user.profile.level}`}>{capitalize(post.user.profile.level)}</Badge>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="flex items-center gap-2">
            <span>추천 {post.like_count}</span>
            <span>댓글 {post.comment_count}</span>

            <span className="cursor-pointer hover:text-gray-500 dark:hover:text-gray-300" onClick={handleClipboard}>
              URL 복사
            </span>

            {user && user?.id == post.user.id && (
              <div className="flex gap-2">
                <Link
                  href={`/boards/${post.category.board.name}/categories/${post.category.name}/posts/${post.id}/edit`}
                >
                  수정하기
                </Link>
                <button onClick={() => mutation.mutate()}>삭제하기</button>
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
