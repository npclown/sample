import request from "@/lib/api/request";
import { Comment, Pagination } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const commentQueryKey = createQueryKeys("comments", {
  comments: (name: string, category: string, id: string, page: number) => ["comments", name, category, id, page],
});

const getCommentList = async (name: string, category: string, id: string, page: number) => {
  try {
    const { data } = await request.get<Pagination<Comment>>(
      `/api/boards/${name}/categories/${category}/posts/${id}/comments/`,
      {
        params: {
          page: page,
        },
      },
    );

    return data;
  } catch (err) {
    throw err;
  }
};

export const useCommentList = (name: string, category: string, id: string, page: number, options = {}) =>
  useQuery({
    queryKey: commentQueryKey.comments(name, category, id, page).queryKey,
    queryFn: () => getCommentList(name, category, id, page),
    ...options,
  });
