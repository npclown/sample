import request from "@/lib/api/request";
import { Board } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const boardQueryKey = createQueryKeys("boards", {
  boards: (sort) => ["boards", sort],
});

const getBoardList = async (sort?: string) => {
  try {
    const { data } = await request.get<{ data: Board[] }>("/api/boards/", {
      params: { sort },
    });

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useBoardList = (sort?: string) =>
  useQuery({
    queryKey: boardQueryKey.boards(sort).queryKey,
    queryFn: () => getBoardList(sort),
  });
