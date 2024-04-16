import UserPresentationEdit from "@/components/portfolio/presentation/user-presentation-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <UserPresentationEdit portfolioId={params.username} />
    </div>
  );
}
