"use client";

import request from "@/lib/api/request";
import { Skill } from "@/lib/definitions";
import { useSkillRecommandList, useSkills } from "@/store/queries/portfolio/portfolio";
import { usePortfolioStore } from "@/store/stores/use-portfolio-store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";

import CommonBadge from "../common-badge";
import CommonCheckbox from "../common-checkbox";
import CommonEdit from "../common-edit";
import SearchSkill from "./search-skill";

const UserSkillEdit = ({ portfolioId }: { portfolioId: string }) => {
  const router = useRouter();
  const { data: recommandSkillList } = useSkillRecommandList();
  const { data: skill } = useSkills(portfolioId);
  const [selectedSkill, setSelectedSkill] = useState<Skill[]>([]);
  const [recommandSkill, setRecommandSkill] = useState<Skill[]>([]);
  const { setLoading } = usePortfolioStore();

  const handleCancelSelectSkill = (value: Skill) => {
    setSelectedSkill((prev: Skill[]) => prev.filter((skill: Skill) => skill.skill_id != value.skill_id));
    setRecommandSkill((prev: Skill[]) =>
      prev.map((skill: Skill) => (skill.id == value.skill_id ? { ...skill, checked: false } : skill)),
    );
  };

  const handleSelectSkill = (checked: boolean, value: Skill) => {
    if (checked) {
      if (selectedSkill.some((skill: Skill) => skill.skill_id === value.id)) {
        return;
      }

      setSelectedSkill((prev: Skill[]) => [...prev, { ...value, skill_id: value.id }]);
      setRecommandSkill((prev: Skill[]) =>
        prev.map((skill: Skill) => (skill.id == value.id ? { ...skill, checked } : skill)),
      );
    } else {
      setSelectedSkill((prev: Skill[]) => prev.filter((skill: Skill) => skill.skill_id != value.id));
      setRecommandSkill((prev: Skill[]) =>
        prev.map((skill: Skill) => (skill.id == value.id ? { ...skill, checked } : skill)),
      );
    }
  };

  const deleteSkill = useMutation({
    mutationFn: async ({ ids }: { ids: [] }) => {
      return await request.delete("/api/user/portfolio/skills/bulk_delete/", {
        data: {
          ids,
        },
      });
    },
  });

  const createSkill = useMutation({
    mutationFn: async ({ id }: { id: string[] }) => {
      return await request.post("/api/user/portfolio/skills/", {
        id,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("스킬 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/profile`);
    },
    onError: (error, variables, context) => {
      toast.success("스킬 등록에 실패했습니다.");
      setLoading(false);
    },
  });

  useLayoutEffect(() => {
    if (recommandSkillList) {
      let skill_id = skill ? skill.map((value: Skill) => value.skill_id) : [];

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

  useLayoutEffect(() => {
    if (skill) {
      setSelectedSkill(skill);
    }
  }, [skill]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const result = selectedSkill.map((skill: Skill) => skill.skill_id).sort();
    deleteSkill.mutate({ ids: skill.map((skill: Skill) => skill.id) });
    // @ts-ignore
    createSkill.mutate({ id: result });
  };

  return (
    <form onSubmit={(e) => onSubmit(e)} className="w-full">
      <CommonEdit cancelLink={`/portfolio/${portfolioId}/profile`} deleteText="">
        <div className="flex w-full flex-col items-start justify-center gap-8 px-2 py-8">
          <div className="text-base font-semibold md:text-xl">내 스킬을 선택해주세요.</div>
          {selectedSkill.length > 0 && (
            <div className="ml-0 mr-auto flex flex-wrap items-center justify-start gap-2">
              {selectedSkill.map((value) => {
                return (
                  <CommonBadge className="bg-[#364154] px-4" key={value.id}>
                    <span className="text-xs font-medium text-[#FAFAFA] dark:text-gray-900 md:text-sm">
                      {value.name}
                    </span>
                    <button onClick={() => handleCancelSelectSkill(value)} className="ml-1 cursor-pointer">
                      <XMarkIcon className="size-4 md:size-5" />
                    </button>
                  </CommonBadge>
                );
              })}
            </div>
          )}

          <SearchSkill handleSelectedSkill={handleSelectSkill} />

          {recommandSkill && <div className="text-sm font-semibold md:text-base">인기 스킬</div>}

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
      </CommonEdit>
    </form>
  );
};

export default UserSkillEdit;
