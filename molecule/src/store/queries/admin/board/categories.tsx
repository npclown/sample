import { BoardCategory } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { Pagination } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const CategoriesQueryKey = createQueryKeys("board", {
  categories: (page) => ["categories", page],
});

const getBoardCategoriesList = async (page: number) => {
  try {
    const { data } = await request.get<Pagination<BoardCategory>>("/api/admin/categories/", {
      params: { page },
    });
    return data;
  } catch (err) {
    throw err;
  }
};

export const useBoardCategoriesList = (page: number) =>
  useQuery({
    queryKey: CategoriesQueryKey.categories(page).queryKey,
    queryFn: () => getBoardCategoriesList(page),
  });
