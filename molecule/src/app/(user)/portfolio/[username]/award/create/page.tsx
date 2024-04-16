import UserAwardEdit from "@/components/portfolio/award/user-award-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserAwardEdit portfolioId={params.username} />
    </div>
  );
}
