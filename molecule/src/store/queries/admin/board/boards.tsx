import { Board } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { Pagination } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const boardQueryKey = createQueryKeys("board", {
  boards: (page) => ["boards", page],
});

const getBoardList = async (page: number) => {
  try {
    const { data } = await request.get<Pagination<Board>>("/api/admin/boards/", {
      params: { page },
    });
    return data;
  } catch (err) {
    throw err;
  }
};

export const useBoardList = (page: number) =>
  useQuery({
    queryKey: boardQueryKey.boards(page).queryKey,
    queryFn: () => getBoardList(page),
  });
