import { Separator } from "@/components/ui/separator";
import { Board } from "@/lib/definitions";
import { getDataSSR } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";

export default async function Category({
  boardName,
  optionCategory = [],
}: {
  boardName: string;
  optionCategory?: string[];
}) {
  // const data = await fetch(`${process.env.api_url ?? "https://ion.dothack.io"}/api/boards/`).then((res) => res.json());
  // const boardList = data.data;
  const boardList = await getDataSSR("/api/boards/");

  return (
    <div className="flex w-full justify-between md:text-lg xl:text-xl">
      <Separator orientation="vertical" className="h-10 bg-gray-300" />
      {boardList?.map(
        (board: Board) =>
          board.type === "post" && (
            <Link
              key={board.name}
              href={`/boards/${board.name}`}
              className={clsx(
                "flex flex-1 cursor-pointer items-center justify-center border-b-[2px] border-r-[1px]  border-t-[1px] border-y-black bg-gray-100 dark:border-y-gray-400 dark:bg-gray-800 xl:dark:bg-gray-700",
                board.name === boardName &&
                  "border-x-[1px] border-b-0 border-t-[3px] border-x-black border-b-transparent border-t-ionblue-500 bg-white dark:border-x-gray-300 dark:border-b-gray-800 xl:dark:border-b-gray-700",
              )}
            >
              <span>{board.label}</span>
            </Link>
          ),
      )}
      <Separator orientation="vertical" className="h-10 bg-gray-300" />
    </div>
  );
}
