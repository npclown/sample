import UserWorkEdit from "@/components/portfolio/work/user-work-edit";

export default function Page({ params }: { params: { username: string; work: string } }) {
  return (
    <div>
      <UserWorkEdit portfolioId={params.username} id={params.work} />
    </div>
  );
}
