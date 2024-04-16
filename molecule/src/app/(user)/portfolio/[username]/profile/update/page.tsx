import UserProfileEdit from "@/components/portfolio/profile/user-profile-edit";

export default function Page({ params }: { params: { username: string } }) {
  return (
    <div className="m-auto w-full md:max-w-[800px]">
      <UserProfileEdit portfolioId={params.username} />
    </div>
  );
}
