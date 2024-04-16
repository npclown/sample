"use client";

import HeatmapView from "@/components/portfolio/activity/heatmap-view";
import UserAward from "@/components/portfolio/award/user-award";
import UserChallenge from "@/components/portfolio/challenge/user-challenge";
import UserEducation from "@/components/portfolio/education/user-education";
import UserLink from "@/components/portfolio/link/user-link";
import UserPresentation from "@/components/portfolio/presentation/user-presentation";
import UserProfile from "@/components/portfolio/profile/user-profile";
import UserProject from "@/components/portfolio/project/user-project";
import UserReport from "@/components/portfolio/report/user-report";
import UserSkill from "@/components/portfolio/skill/user-skill";
import UserTeam from "@/components/portfolio/team/user-team";
import UserWork from "@/components/portfolio/work/user-work";
import { useHeatmap } from "@/store/queries/profile";

export default function Page({ params }: { params: { username: string } }) {
  const { data: heatmap, isLoading } = useHeatmap(params.username);

  return (
    <>
      <div className="flex flex-col gap-5">
        <UserProfile portfolioId={params.username} />
        <UserSkill portfolioId={params.username} />
        <div className="space-y-4 border p-4 shadow-md md:space-y-5 md:px-[30px] md:py-[50px]">
          <div className="text-sm font-bold md:text-xl">활동 통계</div>
          {heatmap && <HeatmapView heatmap={{ from: "2024-01-01", to: "2024-12-31", value: heatmap }} />}
        </div>
        <UserTeam portfolioId={params.username} />
        <UserWork portfolioId={params.username} />
        <UserEducation portfolioId={params.username} />
        <UserPresentation portfolioId={params.username} />
        <UserAward portfolioId={params.username} />
        <UserChallenge portfolioId={params.username} />
        <UserReport portfolioId={params.username} />
        <UserProject portfolioId={params.username} />
        <UserLink portfolioId={params.username} />
      </div>
    </>
  );
}
