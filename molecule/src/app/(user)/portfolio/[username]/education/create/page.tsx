import UserEducationEdit from "@/components/portfolio/education/user-education-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserEducationEdit portfolioId={params.username} />
    </div>
  );
}
