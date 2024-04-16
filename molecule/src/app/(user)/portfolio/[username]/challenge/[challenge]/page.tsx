import UserChallengeEdit from "@/components/portfolio/challenge/user-challenge-edit";

export default function Page({ params }: { params: { username: string; challenge: string } }) {
  return (
    <div>
      <UserChallengeEdit portfolioId={params.username} id={params.challenge} />
    </div>
  );
}
