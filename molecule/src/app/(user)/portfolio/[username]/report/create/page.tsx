import UserReportEdit from "@/components/portfolio/report/user-report-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserReportEdit portfolioId={params.username} />
    </div>
  );
}
