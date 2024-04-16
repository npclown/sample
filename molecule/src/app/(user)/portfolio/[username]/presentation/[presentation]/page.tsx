import UserPresentationEdit from "@/components/portfolio/presentation/user-presentation-edit";

export default function Page({ params }: { params: { username: string; presentation: string } }) {
  return (
    <div>
      <UserPresentationEdit portfolioId={params.username} id={params.presentation} />
    </div>
  );
}
