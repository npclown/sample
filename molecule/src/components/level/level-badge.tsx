import { Badge } from "../ui/badge";

const levelBadgeType = {
  novice: {
    variant: "level-novice",
    value: "Novice",
  },
  pro: {
    variant: "level-pro",
    value: "Pro",
  },
  elite: {
    variant: "level-elite",
    value: "Elite",
  },
  moderator: {
    variant: "level-moderator",
    value: "Moderator",
  },
};

const LevelBadge = ({ level }: { level: "novice" | "pro" | "elite" | "moderator" }) => {
  const current = level ? levelBadgeType[level] : levelBadgeType["novice"];

  return (
    <Badge
      variant={
        current.variant as
          | "default"
          | "secondary"
          | "destructive"
          | "outline"
          | "level-novice"
          | "level-pro"
          | "level-elite"
          | "level-moderator"
          | null
          | undefined
      }
    >
      {current.value}
    </Badge>
  );
};

export default LevelBadge;
