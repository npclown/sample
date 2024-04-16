import request from "@/lib/api/request";
import { Pagination, Skill } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const skillQueryKey = createQueryKeys("skill", {
  getSkillList: (page) => ["skills", page],
});

const getSkillList = async (page: number) => {
  try {
    const { data } = await request.get<Pagination<Skill>>("/api/portfolio_skills/", {
      params: { page },
    });
    return data;
  } catch (err) {
    throw err;
  }
};

export const useSkillList = (page: number) =>
  useQuery({
    queryKey: skillQueryKey.getSkillList(page).queryKey,
    queryFn: () => getSkillList(page),
  });
