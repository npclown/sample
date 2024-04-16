import UserEducation from "@/components/portfolio/education/user-education";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserEducation portfolioId={params.username} />
    </div>
  );
}
