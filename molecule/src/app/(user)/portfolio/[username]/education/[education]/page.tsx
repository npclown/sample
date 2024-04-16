import UserEducationEdit from "@/components/portfolio/education/user-education-edit";

export default function Page({ params }: { params: { username: string; education: string } }) {
  return (
    <div>
      <UserEducationEdit portfolioId={params.username} id={params.education} />
    </div>
  );
}
