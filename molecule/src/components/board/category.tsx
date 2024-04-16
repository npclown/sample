import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generatorBoardUrl } from "@/lib/utils";
import { useCategoryList } from "@/store/queries/board/category/list";
import { useBoardStore } from "@/store/stores/use-board-store";
import { CheckIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Category() {
  const board = useBoardStore((state) => state.board);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: categorys,
    isLoading,
    isError,
  } = useCategoryList(board?.name ?? "", {
    enabled: board != null,
  });
  const boardType = board?.type == "question" ? "questions" : "boards";

  const handleCategory = (category: string) => {
    const url = generatorBoardUrl(boardType, board?.name ?? "", category == "all" ? "" : category, "", "", "");
    router.push(url);
  };

  if (isLoading || isError) return <></>;

  return (
    <div className="flex text-sm md:text-base">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-black dark:text-gray-200">
          <ChevronDownIcon className="size-4" />
          <span>{searchParams.get("category") ?? "전체"}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              handleCategory("all");
            }}
            className={clsx("flex gap-1", searchParams.get("category") === null && "font-bold")}
          >
            전체
            {searchParams.get("category") === null && <CheckIcon className="size-4" />}
          </DropdownMenuItem>
          {board?.name !== "all" &&
            categorys?.map((category, index) => (
              <DropdownMenuItem
                onClick={() => {
                  handleCategory(category.name);
                }}
                key={index}
                className={clsx("flex gap-1", searchParams.get("category") === category.name && "font-bold")}
              >
                {category.label}
                {searchParams.get("category") === category.name && <CheckIcon className="size-4" />}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
