import request from "@/lib/api/request";
import { Post } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const postQueryKey = createQueryKeys("post", {
  post: (name: string, category: string, id: string) => ["post", name, category, id],
});

const getPost = async (name: string, category: string, id: string) => {
  try {
    const { data } = await request.get<{ data: Post }>(`/api/boards/${name}/categories/${category}/posts/${id}/`);
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const usePost = (name: string, category: string, id: string, options?: {}) =>
  useQuery({
    queryKey: postQueryKey.post(name, category, id).queryKey,
    queryFn: () => getPost(name, category, id),
    ...options,
  });
