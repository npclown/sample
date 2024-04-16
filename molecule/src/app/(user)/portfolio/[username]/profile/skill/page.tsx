import UserSkillEdit from "@/components/portfolio/skill/user-skill-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div className="m-auto max-w-[800px]">
      <UserSkillEdit portfolioId={params.username} />
    </div>
  );
}
