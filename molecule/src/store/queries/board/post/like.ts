import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const likeQueryKey = createQueryKeys("like", {
  like: (name: string | undefined, id: number) => ["like", name, id],
});

const getLike = async (name: string | undefined, id: number) => {
  try {
    const { data } = await request.get<{ data: number }>(`/api/boards/${name}/posts/${id}/like/`);

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const usePostList = (name: string | undefined, id: number) =>
  useQuery({
    queryKey: likeQueryKey.like(name, id).queryKey,
    queryFn: () => getLike(name, id),
  });
