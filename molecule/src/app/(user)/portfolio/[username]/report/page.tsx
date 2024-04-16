import UserReport from "@/components/portfolio/report/user-report";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserReport portfolioId={params.username} />
    </div>
  );
}
