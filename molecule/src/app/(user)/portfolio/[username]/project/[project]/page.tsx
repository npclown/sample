import UserProjectEdit from "@/components/portfolio/project/user-project-edit";

export default function Page({ params }: { params: { username: string; project: string } }) {
  return (
    <div>
      <UserProjectEdit portfolioId={params.username} id={params.project} />
    </div>
  );
}
