"use client";

import { Skill } from "@/lib/definitions";
import { useSkillList } from "@/store/queries/portfolio/portfolio";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

import { ScrollArea } from "../../ui/scroll-area";

const SearchSkill = ({ handleSelectedSkill }: { handleSelectedSkill: Function }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { data: skillList } = useSkillList();
  const [focus, setFocus] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<Skill[]>([]);

  const handleSearch = (e: any) => {
    const word = e.target.value;

    setSearch(word);

    if (word == "") {
      setResult([]);
    } else {
      setResult(skillList.filter((skill: Skill) => skill.name.toLowerCase().includes(word.toLowerCase())));
    }
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (divRef.current && !divRef.current.contains(event.target)) {
        setFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  return (
    <div ref={divRef} className="w-full">
      <div className="relative w-full">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="스킬을 검색해보세요."
          className="peer w-full rounded-lg border border-gray-200 px-1 py-2 indent-2 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-ring dark:border-gray-600 dark:focus:border-gray-500"
          value={search}
          onFocus={(e) => setFocus(true)}
        />

        <div className="absolute inset-y-0 right-2 flex items-center text-gray-400 transition peer-focus:text-black dark:peer-focus:text-white">
          {search == "" ? (
            <MagnifyingGlassIcon className="size-4 md:size-5" />
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                setSearch("");
                setFocus(false);
                setResult([]);
              }}
            >
              <XCircleIcon className="size-4 md:size-5" />
            </button>
          )}
        </div>
      </div>
      {focus &&
        (result.length > 0 ? (
          <ScrollArea className="mt-2 h-[144px] rounded-md border">
            {result.map((skill) => (
              <div
                key={skill.id}
                className="cursor-pointer px-3 py-2 text-xs hover:bg-ionblue-100 md:text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectedSkill(true, skill);
                  setFocus(false);
                }}
              >
                {skill.name}
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="mt-2 flex h-[144px] items-center justify-center rounded-md border text-xs">
            검색 결과가 없습니다.
          </div>
        ))}
    </div>
  );
};

export default SearchSkill;
