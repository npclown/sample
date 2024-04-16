"use client";

import HeatmapView from "@/components/portfolio/activity/heatmap-view";
import UserAnswer from "@/components/portfolio/activity/user-answer";
import UserPost from "@/components/portfolio/activity/user-post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeatmap } from "@/store/queries/profile";

export default function Page({ params }: { params: { username: string } }) {
  const { data: heatmap, isLoading } = useHeatmap(params.username);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4 border p-4 shadow-md md:space-y-5 md:px-[30px] md:py-[50px]">
        <div className="text-sm font-bold md:text-xl">활동 통계</div>
        <HeatmapView heatmap={{ from: "2024-01-01", to: "2024-12-31", value: heatmap }} />
      </div>
      <Tabs defaultValue="post" className="w-full  ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="post">게시물</TabsTrigger>
          <TabsTrigger value="answer">답변</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <UserPost portfolioId={params.username} />
        </TabsContent>
        <TabsContent value="answer">
          <UserAnswer portfolioId={params.username} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
