import request from "@/lib/api/request";
import { Pagination, Post, SearchRange } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const popularPostQueryKey = createQueryKeys("popular_posts", {
  popular_posts: () => ["popular_posts"],
});

const getPopularPostList = async () => {
  try {
    const { data } = await request.get<{ data: Post[] }>(`/api/posts/popular/`);

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const usePopularPostList = () =>
  useQuery({
    queryKey: popularPostQueryKey.popular_posts().queryKey,
    queryFn: () => getPopularPostList(),
  });
