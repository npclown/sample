import UserAwardEdit from "@/components/portfolio/award/user-award-edit";

export default function Page({ params }: { params: { username: string; award: string } }) {
  return (
    <div>
      <UserAwardEdit portfolioId={params.username} id={params.award} />
    </div>
  );
}
