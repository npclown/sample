import request from "@/lib/api/request";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const profileQueryKey = createQueryKeys("user", {
  getActivityList: (profileUrl: string, params: { from: Date | string; to: Date | string }) => [
    "activitiyList",
    profileUrl,
    params,
  ],
  getHeatmap: (profileUrl: string) => ["heatmap", profileUrl],
  getRadar: (profileUrl: string) => ["radar", profileUrl],
  getPopularContent: (profileUrl: string) => ["popularContent", profileUrl],
  getAchievement: (profileUrl: string) => ["achievement", profileUrl],
});

const getActivityList = async (profileUrl: string, params: { from: Date | string; to: Date | string }) => {
  const { data } = await request.get(`/api/profile/${profileUrl}/activities/?from=${params.from}&to=${params.to}`);
  return data.data;
};

const getHeatmap = async (profileUrl: string) => {
  const { data } = await request.get(`/api/profile/${profileUrl}/heatmap/`);
  return data.data;
};

const getRadar = async (profileUrl: string) => {
  const { data } = await request.get(`/api/profile/${profileUrl}/radar/`);
  return data.data;
};

const getPopularContent = async (profileUrl: string) => {
  const { data } = await request.get(`/api/profile/${profileUrl}/popular/`);
  return data.data;
};

const getAchievement = async (profileUrl: string) => {
  const { data } = await request.get(`/api/profile/${profileUrl}/achievements/`);
  return data.data;
};

export const useActivityList = (profileUrl: string, params: { from: Date | string; to: Date | string }) =>
  useQuery({
    queryKey: profileQueryKey.getActivityList(profileUrl, params).queryKey,
    queryFn: () => getActivityList(profileUrl, params),
  });

export const useHeatmap = (profileUrl: string) =>
  useQuery({
    queryKey: profileQueryKey.getHeatmap(profileUrl).queryKey,
    queryFn: () => getHeatmap(profileUrl),
  });

export const useRadar = (profileUrl: string) =>
  useQuery({
    queryKey: profileQueryKey.getRadar(profileUrl).queryKey,
    queryFn: () => getRadar(profileUrl),
  });
