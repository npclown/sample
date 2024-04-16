import request from "@/lib/api/request";
import { Comment } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const commentLikeQueryKey = createQueryKeys("like", {
  isLike: (name: string | undefined, category: string, post: number, id: number) => [
    "isLike",
    name,
    category,
    post,
    id,
  ],
});

const getCommentIsLike = async (name: string, category: string, post: number, id: number) => {
  try {
    const { data } = await request.get<{ data: number }>(
      `/api/boards/${name}/categories/${category}/posts/${post}/comments/${id}/like/`,
    );

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useCommentIsLike = (name: string, category: string, post: number, id: number) =>
  useQuery({
    queryKey: commentLikeQueryKey.isLike(name, category, post, id).queryKey,
    queryFn: () => getCommentIsLike(name, category, post, id),
  });
