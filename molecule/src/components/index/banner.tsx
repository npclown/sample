import { Skeleton } from "@/components/ui/skeleton";
import { useBannerList } from "@/store/queries/banner/banners";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const properties = {
  prevArrow: (
    <button className="text-gray-300">
      <ChevronLeftIcon className="h-10 w-10" />
    </button>
  ),
  nextArrow: (
    <button className="text-gray-300">
      <ChevronRightIcon className="h-10 w-10" />
    </button>
  ),
  transitionDuration: 600,
  easing: "cubic",
};

export default function Banner() {
  const { data: banners, isError, isFetched } = useBannerList();

  if (isError || !isFetched) return <BannerSkeleton />;

  return (
    <div className="relative mx-auto mb-4 max-w-screen-2xl rounded-lg bg-white shadow-md dark:bg-gray-700">
      <Slide {...properties}>
        {isFetched &&
          banners?.map((banner, index) => (
            <Fragment key={banner.id}>
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute mt-48">
                  <h1 className="text-2xl font-bold">{banner.title}</h1>
                  <p className="text-xl text-gray-700">{banner.description}</p>
                </div>
              </div>

              <picture key={index}>
                <img src={banner.image_url} alt="" className="h-52 w-full rounded-lg object-cover" />
              </picture>
            </Fragment>
          ))}
      </Slide>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative mx-auto mb-4 max-w-screen-2xl rounded-lg bg-white shadow-md dark:bg-gray-700">
      <Skeleton className="h-52 w-full rounded-lg object-cover" />
    </div>
  );
}
