import { DistanceTime } from "@/components/time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { User } from "@/lib/definitions";
import { capitalize } from "@/lib/utils";
import React from "react";

export default function UserCard({ type = "profile-image", user }: { type?: "single" | "profile-image"; user: User }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2">
          {type === "profile-image" ? (
            <>
              <Avatar className="size-8">
                <AvatarImage src={user.profile?.image_url} />
                <AvatarFallback>Ion</AvatarFallback>
              </Avatar>
              <span>{user.nickname == "" ? "익명" : user.nickname}</span>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span>{user.nickname.slice(0, 12)}</span>
            </div>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-start space-x-4">
          <Avatar>
            <AvatarImage src={user.profile.image_url} />
            <AvatarFallback>Ion</AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-left">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <span>{user.nickname}</span>
              <Badge variant={`level-${user.profile.level}`}>{capitalize(user.profile.level)}</Badge>
            </h4>
            <p className="text-sm">유저 자기소개 내용 입력</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                <DistanceTime time={new Date()} /> 가입
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
