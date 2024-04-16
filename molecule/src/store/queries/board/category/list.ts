import request from "@/lib/api/request";
import { Category } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const CategoryQueryKey = createQueryKeys("categorys", {
  categorys: (name: string) => ["categorys", name],
});

const getCategoryList = async (name: string) => {
  try {
    const { data } = await request.get<{ data: Category[] }>(`/api/boards/${name}/categories/`);

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useCategoryList = (name: string, options?: {}) =>
  useQuery({
    queryKey: CategoryQueryKey.categorys(name).queryKey,
    queryFn: () => getCategoryList(name),
    ...options,
  });
