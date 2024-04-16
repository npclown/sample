"use client";

import { usePosts } from "@/store/queries/portfolio/portfolio";
import { useEffect } from "react";

import PostSkeleton from "./post-skeleton";
import PostView from "./post-view";

const UserPost = ({ portfolioId }: { portfolioId: string }) => {
  const { data: post, isLoading, refetch } = usePosts(portfolioId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    post && (
      <div className="space-y-2">
        <div>게시물 {post.length}개</div>
        <div className="space-y-4">
          {post.map((postInfo: any) => {
            return <PostView key={postInfo.id} postInfo={postInfo} refetch={refetch} />;
          })}
        </div>
      </div>
    )
  );
};

export default UserPost;
