import UserTeam from "@/components/portfolio/team/user-team";
import UserWork from "@/components/portfolio/work/user-work";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserTeam portfolioId={params.username} />
      <UserWork portfolioId={params.username} />
    </div>
  );
}
