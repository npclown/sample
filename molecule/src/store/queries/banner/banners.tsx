import request from "@/lib/api/request";
import { Banner } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const bannerQueryKey = createQueryKeys("banners", {
  banners: () => ["banners"],
});

const getBannerList = async () => {
  try {
    const { data } = await request.get<{ data: Banner[] }>("/api/banners/");
    return data?.data;
  } catch (err) {
    throw err;
  }
};

export const useBannerList = () =>
  useQuery({
    queryKey: bannerQueryKey.banners().queryKey,
    queryFn: () => getBannerList(),
  });