import UserLinkEdit from "@/components/portfolio/link/user-link-edit";

export default function Page({ params }: { params: { username: string } }) {
  return <UserLinkEdit portfolioId={params.username} />;
}
