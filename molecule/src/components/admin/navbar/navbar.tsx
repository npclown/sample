import Auth from "@/components/admin/navbar/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-8 dark:bg-gray-900">
      <Link className="text-xl font-bold uppercase" href="/">
        <Image width="64" height="40" src="/img/logo.png" alt="Ion" className="mx-8" priority />
      </Link>

      <Auth />
    </header>
  );
}
