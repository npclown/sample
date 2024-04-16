import request from "@/lib/api/request";
import { Board } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const boardQueryKey = createQueryKeys("board", {
  board: (name: string) => ["board", name],
});

const getBoard = async (name: string) => {
  try {
    const { data } = await request.get<{ data: Board }>(`/api/boards/${name}/`);
    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useBoard = (name: string, options?: {}) =>
  useQuery({
    queryKey: boardQueryKey.board(name).queryKey,
    queryFn: () => getBoard(name),
    ...options,
  });
