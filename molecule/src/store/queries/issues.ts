import request from "@/lib/api/request";
import { Post } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const issueQuerykey = createQueryKeys("issues", {
  getissueList: () => ["issueList"],
  getIssue: () => ["issues"],
});

const getIssueList = async () => {
  const { data } = await request.get<{ data: Post[] }>(`/api/posts/popular/`);
  return data.data;
};

export const useIssueList = () =>
  useQuery({
    queryKey: issueQuerykey.getissueList().queryKey,
    queryFn: () => getIssueList(),
  });
