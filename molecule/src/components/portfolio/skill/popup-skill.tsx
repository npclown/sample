import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skill } from "@/lib/definitions";
import { useSkillRecommandList } from "@/store/queries/portfolio/portfolio";
import { MagnifyingGlassIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLayoutEffect, useState } from "react";

import CommonBadge from "../common-badge";
import CommonButton from "../common-button";
import CommonCheckbox from "../common-checkbox";
import SearchSkill from "./search-skill";

const PopupSkill = ({
  selectedSkill,
  setSelectedSkill,
}: {
  portfolioId: string;
  selectedSkill: Skill[];
  setSelectedSkill: Function;
}) => {
  const { data: recommandSkillList } = useSkillRecommandList();
  const [skill, setSkill] = useState<Skill[]>(selectedSkill);
  const [recommandSkill, setRecommandSkill] = useState<Skill[]>([]);

  const handleCancelSelectSkill = (value: Skill) => {
    setSkill((prev: Skill[]) => prev.filter((skill) => skill.id != value.id));
    setRecommandSkill((prev: Skill[]) =>
      prev.map((skill) => (skill.id == value.id ? { ...skill, checked: false } : skill)),
    );
  };

  const handleSelectSkill = (checked: boolean, value: Skill) => {
    if (checked) {
      if (skill.some((skill: Skill) => skill.id === value.id)) {
        return;
      }

      setSkill((prev: Skill[]) => [...prev, value]);
      setRecommandSkill((prev: Skill[]) =>
        prev.map((skill: Skill) => (skill.id == value.id ? { ...skill, checked } : skill)),
      );
    } else {
      setSkill((prev: Skill[]) => prev.filter((skill: Skill) => skill.id != value.id));
      setRecommandSkill((prev: Skill[]) =>
        prev.map((skill: Skill) => (skill.id == value.id ? { ...skill, checked } : skill)),
      );
    }
  };

  useLayoutEffect(() => {
    if (recommandSkillList) {
      let skill_id = skill ? skill.map((value: Skill) => value.id) : [];
      setRecommandSkill(
        recommandSkillList.map((value: Skill) => {
          if (skill_id.includes(value.id)) {
            return { ...value, checked: true };
          }

          return { ...value };
        }),
      );
    }
  }, [recommandSkillList, skill]);

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {selectedSkill.length == 0 ? (
          <div className="relative w-full">
            <input
              type="text"
              placeholder="사용한 스킬을 입력해주세요."
              className="peer w-full rounded-lg border border-gray-200 px-1 py-2 indent-2 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-ring dark:border-gray-600 dark:focus:border-gray-500"
              readOnly
            />

            <div className="absolute inset-y-0 right-2 flex items-center text-gray-400 transition peer-focus:text-black dark:peer-focus:text-white">
              <MagnifyingGlassIcon className="size-4 md:size-5" />
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-center gap-2">
            <PencilIcon className="size-4 md:size-5" />
            <span className="font-medium text-[#364154] dark:text-gray-300">스킬 편집</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>내 스킬을 선택해주세요.</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {skill && (
            <div className="ml-0 mr-auto flex flex-wrap items-center justify-start gap-2">
              {skill.map((value) => {
                return (
                  <CommonBadge className="bg-[#364154] px-4" key={value.id}>
                    <span className="text-xs font-medium text-[#FAFAFA] dark:text-gray-900 md:text-sm">
                      {value.name}
                    </span>
                    <button onClick={() => handleCancelSelectSkill(value)} className="ml-1">
                      <XMarkIcon className="size-4 md:size-5" />
                    </button>
                  </CommonBadge>
                );
              })}
            </div>
          )}
          <SearchSkill handleSelectedSkill={handleSelectSkill} />
          <div className="text-sm font-semibold md:text-base">인기 스킬</div>
          <div className="flex flex-wrap items-center gap-2">
            {recommandSkill.map((value: Skill) => {
              return (
                <CommonCheckbox
                  key={value.id}
                  id={value.name}
                  onCheckedChange={(checked: boolean) => handleSelectSkill(checked, value)}
                  checked={value.checked}
                  hidden
                >
                  <CommonBadge
                    className={
                      value.checked
                        ? "border-[#E3E8EF] bg-[#364154] px-4 text-[#FAFAFA]"
                        : "border-[#E3E8EF] bg-[#FFFFFF] px-4 text-[#0F0F0F]"
                    }
                  >
                    {value.name}
                  </CommonBadge>
                </CommonCheckbox>
              );
            })}
          </div>
        </div>
        <DialogFooter className="mt-4 flex flex-row justify-center gap-4">
          <DialogClose asChild>
            <CommonButton variant="outline" className="w-[100px]">
              취소
            </CommonButton>
          </DialogClose>
          <DialogClose asChild>
            <CommonButton className="w-[100px]" onClick={(e) => setSelectedSkill(skill)}>
              완료
            </CommonButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopupSkill;
