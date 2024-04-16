import UserTeamEdit from "@/components/portfolio/team/user-team-edit";

export default function Page({ params }: { params: { username: string; team: string } }) {
  return (
    <div>
      <UserTeamEdit portfolioId={params.username} id={params.team} />
    </div>
  );
}
