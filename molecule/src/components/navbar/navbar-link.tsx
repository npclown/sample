import { Navigation } from "@/lib/definitions";
import { getDataSSR } from "@/lib/utils";
import Link from "next/link";

const NavbarLink = async () => {
  // const data = await fetch(`${process.env.api_url ?? "https://ion.dothack.io"}/api/navigations/`).then((res) =>
  //   res.json(),
  // );
  // const navigations = data.data;
  const navigations = await getDataSSR("/api/navigations/");

  return (
    <div className="mx-auto flex flex-col items-center gap-20 font-sans text-2xl font-bold text-gray-500 dark:text-gray-400 md:mx-auto md:flex-row md:gap-8 md:text-base xl:ml-10 xl:mr-auto xl:text-lg">
      {navigations?.map((navigation: Navigation) => {
        return (
          <Link
            className="transition hover:text-gray-900 dark:hover:text-gray-200"
            href={`${navigation.link}`}
            key={`navigation-${navigation.id}`}
          >
            <span>{navigation.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavbarLink;
