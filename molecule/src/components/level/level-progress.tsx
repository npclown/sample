import { Progress } from "../ui/progress";

const levelProgessType = {
  novice: {
    progress: "bg-ionblue-400",
    next: 2048,
  },
  pro: {
    progress: "bg-emerald-400",
    next: 8192,
  },
  elite: {
    progress: "bg-rose-400",
    next: 2147483648,
  },
  moderator: {
    progress: "bg-rose-400",
    next: 2147483648,
  },
};

const LevelProgress = ({ level, point }: { level: "novice" | "pro" | "elite" | "moderator"; point: number }) => {
  const current = level ? levelProgessType[level] : levelProgessType["novice"];

  const value = (point / current.next) * 100;

  return <Progress className="h-3 shadow-md" progressClassName={current.progress} value={value > 100 ? 100 : value} />;
};

export default LevelProgress;
