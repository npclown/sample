import UserTeamEdit from "@/components/portfolio/team/user-team-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserTeamEdit portfolioId={params.username} />
    </div>
  );
}
