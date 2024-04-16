import UserProject from "@/components/portfolio/project/user-project";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserProject portfolioId={params.username} />
    </div>
  );
}
