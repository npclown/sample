import UserAward from "@/components/portfolio/award/user-award";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserAward portfolioId={params.username} />
    </div>
  );
}
