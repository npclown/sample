import UserProjectEdit from "@/components/portfolio/project/user-project-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserProjectEdit portfolioId={params.username} />
    </div>
  );
}
