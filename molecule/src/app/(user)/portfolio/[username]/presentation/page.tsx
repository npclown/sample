import UserPresentation from "@/components/portfolio/presentation/user-presentation";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserPresentation portfolioId={params.username} />
    </div>
  );
}
