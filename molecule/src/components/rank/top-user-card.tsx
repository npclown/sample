import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/definitions";
import { capitalize, cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function TopUserCard({ rank, user, children }: { rank: number; user: User; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center gap-3 border border-gray-500 p-2 dark:border-gray-300 md:p-5",
      )}
    >
      {rank <= 3 ? (
        <picture className="absolute left-0 top-0">
          <img src={`/img/top${rank}.png`} alt="medal" className="size-10 md:size-14" />
        </picture>
      ) : (
        <span className="absolute left-4 top-1 text-xl text-gray-500 md:text-2xl">{rank}</span>
      )}

      <Avatar className="relative size-12 overflow-hidden rounded-full border border-gray-300 md:size-20">
        <AvatarImage src={user.profile.image_url} />
        <AvatarFallback>프로필 사진</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-1 xl:flex-row">
        <span className="text-sm md:text-base">{user.nickname}</span>
        <Badge variant={`level-${user.profile.level}`}>{capitalize(user.profile.level)}</Badge>
      </div>

      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
