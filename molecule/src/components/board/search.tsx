"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchRange } from "@/lib/definitions";
import { generatorBoardUrl } from "@/lib/utils";
import { useBoardStore } from "@/store/stores/use-board-store";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const Search = () => {
  const router = useRouter();
  const board = useBoardStore((state) => state.board);
  const searchParams = useSearchParams();
  const searchType = searchParams.get("type") ?? "all";
  const keyword = searchParams.get("keyword") ?? "";
  const boardType = board?.type == "question" ? "questions" : "boards";
  const category = searchParams.get("category") ?? "";

  const [type, setType] = useState<SearchRange>(searchType as SearchRange);
  const [word, setWord] = useState<string>(keyword ?? "");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const url = generatorBoardUrl(boardType, board!.name, category, word, type, "");
      router.push(url);
    },
    [boardType, board, category, word, type, router],
  );

  return (
    <div className="mx-auto text-xs md:text-sm">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Select onValueChange={(value: SearchRange) => setType(value)} value={type}>
          <SelectTrigger className="w-[80px] text-xs dark:bg-gray-600 md:w-[120px] md:text-sm">
            <SelectValue placeholder="전체" defaultValue={"all"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="title">제목</SelectItem>
            <SelectItem value="content">내용</SelectItem>
            <SelectItem value="nickname">닉네임</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <input
            onChange={(e) => setWord(e.target.value)}
            type="text"
            placeholder="커뮤니티 내에서 검색"
            className="peer w-full rounded-lg border border-gray-200 px-1 py-2 indent-2 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-ring dark:border-gray-600 dark:focus:border-gray-500 md:w-96"
          />

          <div className="absolute inset-y-0 right-2 flex items-center text-gray-400 transition peer-focus:text-black dark:peer-focus:text-white">
            <button type="submit">
              <MagnifyingGlassIcon className="size-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Search;
