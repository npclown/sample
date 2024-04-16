import request from "@/lib/api/request";
import { Pagination, Post, SearchRange } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const settingUrl = (name: string, category: string | undefined, sort: string | undefined) => {
  if (name === "all") return `/api/posts/`;
  else if (name === "popular") return `/api/posts/popular/`;
  else if (category === "") return `/api/boards/${name}/posts/`;
  else if (category) return `/api/boards/${name}/categories/${category}/posts/`;
  else return `/api/posts/`;
};

const postQueryKey = createQueryKeys("posts", {
  posts: (
    name: string,
    page: number,
    range: SearchRange,
    keyword: string | undefined,
    category: string | undefined,
    sort: string | undefined,
    type: string | undefined,
  ) => ["posts", name, page, range, keyword, category, sort, type],
});

const getPostList = async (
  name: string,
  page: number,
  range: SearchRange,
  keyword: string | undefined,
  category: string | undefined,
  sort: string | undefined,
  type: string | undefined,
) => {
  try {
    const url = settingUrl(name, category, sort);

    const { data } = await request.get<Pagination<Post>>(url, {
      params: {
        page: page,
        search_range: range,
        search_keyword: keyword,
        sort: sort,
        type: type,
      },
    });

    return { posts: data.data, totalCount: data.count };
  } catch (err) {
    throw err;
  }
};

export const usePostList = (
  name: string,
  page: number,
  range: SearchRange,
  keyword: string | undefined,
  category: string | undefined,
  sort: string | undefined,
  type: string | undefined,
  options?: {},
) =>
  useQuery({
    queryKey: postQueryKey.posts(name, page, range, keyword, category, sort, type).queryKey,
    queryFn: () => getPostList(name, page, range, keyword, category, sort, type),
    ...options,
  });
