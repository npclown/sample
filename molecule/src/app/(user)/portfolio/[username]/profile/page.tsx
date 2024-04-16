"use client";

import UserLink from "@/components/portfolio/link/user-link";
import UserProfile from "@/components/portfolio/profile/user-profile";
import UserSkill from "@/components/portfolio/skill/user-skill";
import { Separator } from "@/components/ui/separator";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserProfile portfolioId={params.username} />
      <Separator />
      <UserSkill portfolioId={params.username} />
      <Separator />
      <UserLink portfolioId={params.username} />
    </div>
  );
}
