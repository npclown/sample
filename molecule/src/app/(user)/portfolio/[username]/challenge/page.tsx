import UserChallenge from "@/components/portfolio/challenge/user-challenge";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserChallenge portfolioId={params.username} />
    </div>
  );
}
