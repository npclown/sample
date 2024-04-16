import request from "@/lib/api/request";
import { Comment } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const commentQueryKey = createQueryKeys("comment", {
  comment: (name: string, category: string, post: number, id: number) => ["reply", name, category, post, id],
});

const getComment = async (name: string, category: string, post: number, id: number) => {
  try {
    const { data } = await request.get<{ data: Comment }>(
      `/api/boards/${name}/categories/${category}/posts/${post}/comments/${id}/`,
    );

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useComment = (name: string, category: string, post: number, id: number, options: {}) =>
  useQuery({
    queryKey: commentQueryKey.comment(name, category, post, id).queryKey,
    queryFn: () => getComment(name, category, post, id),
    ...options,
  });
