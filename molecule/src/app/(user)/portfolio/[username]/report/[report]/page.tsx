import UserReportEdit from "@/components/portfolio/report/user-report-edit";

export default function Page({ params }: { params: { username: string; report: string } }) {
  return (
    <div>
      <UserReportEdit portfolioId={params.username} id={params.report} />
    </div>
  );
}
