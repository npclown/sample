import { Level } from "@/lib/definitions";
import { type ClassValue, clsx } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(value: string): void {
  navigator.clipboard.writeText(value);
  toast.success("클립보드에 복사되었습니다.");
}

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
export const capitalize = <T extends string>(s: T) => (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export function nextLevel(level: Level) {
  if (level === "novice") return capitalize("pro");
  if (level === "pro") return capitalize("elite");
  return null;
}

export function nextLevelPoint(level: Level, point: number): number | null {
  if (level === "novice") return 2048 - point;
  if (level === "pro") return 8192 - point;
  return null;
}

export function formatDateYM(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  // JavaScript의 getMonth()는 0부터 시작하므로, 실제 월을 얻기 위해 1을 더해야 합니다.
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // '0'을 추가하여 두 자릿수로 만듭니다.
  return `${year}.${month}`;
}

export function formatDateYMD(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  // getMonth()는 0부터 시작하므로 1을 더해줍니다. 또한, toString().padStart(2, '0')를 사용하여 두 자릿수로 만듭니다.
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // getDate()는 일(day)을 반환합니다. toString().padStart(2, '0')를 사용하여 두 자릿수로 만듭니다.
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function generatorBoardUrl(
  boardType: string,
  boardName: string,
  category: string,
  seachKeyword: string,
  searchType: string,
  sort: string,
) {
  const main_url = `/${boardType}/${boardName}`;

  const queries = [];

  if (category != "") {
    queries.push(`category=${category}`);
  }

  if (searchType != "") {
    queries.push(`type=${searchType}`);
  }

  if (seachKeyword != "") {
    queries.push(`keyword=${seachKeyword}`);
  }

  if (sort != "") {
    queries.push(`sort=${sort}`);
  }

  return `${main_url}?${queries.join("&")}`;
}

export async function getDataSSR(url: string) {
  const result = await fetch(
    `${process.env.api_url ?? process.env.NEXT_PUBLIC_api_url ?? "https://ion.dothack.io"}${url}`,
  );
  const data = await result.json();

  return data.data;
}
