import { Board, Post } from "@/lib/definitions";
import { create } from "zustand";

interface BoardState {
  board: Board | undefined | null;
  post: Post | undefined | null;
  postReload: boolean;
  commentReload: boolean;
}

interface BoardAction {
  setBoard: (board: Board) => void;
  setPost: (post: Post) => void;
  togglePostReload: () => void;
  toggleCommentReload: () => void;
}

export const useBoardStore = create<BoardState & BoardAction>(
  // @ts-ignore
  (set) => ({
    board: null,
    post: null,
    postReload: false,
    commentReload: false,
    setBoard: (board: Board) => set({ board: board }),
    setPost: (post: Post) => set({ post: post }),
    togglePostReload: () =>
      set((state: BoardState) => ({
        postReload: !state.postReload,
      })),
    toggleCommentReload: () =>
      set((state: BoardState) => ({
        commentReload: !state.commentReload,
      })),
  }),
);
