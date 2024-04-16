"use client";

import { useProfile } from "@/store/queries/portfolio/portfolio";
import { ShareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import UserAvatar from "../../user/user-avatar";
import CommonButton from "../common-button";
import ProfileSkeleton from "./profile-skeleton";

const UserProfile = ({ portfolioId }: { portfolioId: string }) => {
  const { data: profile, isLoading, refetch } = useProfile(portfolioId);
  const pRef = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);

  // 공유하기
  const copyToClipboard = async (textToCopy: string) => {
    const hostWithPort = window.location.host;
    const copy = `http://${hostWithPort}${textToCopy}`;

    if ("clipboard" in navigator) {
      // navigator.clipboard API를 사용할 수 있는 경우
      try {
        await navigator.clipboard.writeText(copy);
        toast.success("클립보드에 복사되었습니다!");
      } catch (err) {
        // 클립보드에 복사 실패
        toast.error("클립보드에 복사를 실패했습니다.");
      }
    } else {
      // document.execCommand를 통한 대체 방법 (구형 브라우저 대응)
      const textarea = document.createElement("textarea");
      textarea.value = copy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("클립보드에 복사되었습니다!");
    }
  };

  // TODO:: API 팔로우 요청/취소 구현 필요
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (pRef.current) {
      if (pRef.current.scrollHeight > pRef.current.clientHeight) {
        setMore(false);
      } else {
        setMore(true);
      }
    }
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    profile && (
      <div className="flex flex-col items-center justify-between space-y-8 p-4 shadow-md md:flex-row md:px-[80px] md:py-[50px] xl:p-[110px]">
        <UserAvatar
          className={"size-[120px] rounded-full shadow-md md:size-[140px] xl:size-[180px]"}
          profile_image={profile.image_url}
        />
        <div className="flex w-full flex-col items-end gap-3 md:w-auto md:gap-5">
          <div className="flex justify-end gap-3 md:gap-5">
            {profile.is_owner ? (
              <>
                <CommonButton variant="outline" className="h-6 px-3 py-2 md:h-9 md:px-4 md:py-2">
                  <ShareIcon
                    className="size-4 md:size-5"
                    onClick={(e) => copyToClipboard(`/portfolio/${profile.profile_url}`)}
                  />
                </CommonButton>
                <Link href={`/portfolio/${portfolioId}/profile/update`}>
                  <CommonButton variant="outline" className="h-6 px-3 py-2 text-xs md:h-9 md:px-4 md:py-2 md:text-sm">
                    편집
                  </CommonButton>
                </Link>
              </>
            ) : (
              <>
                {profile.is_follwer ? (
                  <CommonButton
                    variant="outline"
                    className="h-6 w-[60px] bg-ionblue-500 px-3 py-2 text-xs md:h-9 md:w-[94px] md:px-4 md:py-2 md:text-sm"
                    // onClick={() => setUserInfo({ ...userInfo, is_follwer: !userInfo.is_follwer })}
                  >
                    <Image src="/icon/user_verification.png" width={20} height={20} alt="user verification" />
                  </CommonButton>
                ) : (
                  <CommonButton
                    variant="outline"
                    className="h-6 px-3 py-2 text-xs md:h-9 md:px-4 md:py-2 md:text-sm"
                    // onClick={() => setUserInfo({ ...userInfo, is_follwer: !userInfo.is_follwer })}
                  >
                    팔로우
                  </CommonButton>
                )}
                <CommonButton variant="outline" className="h-6 px-3 py-2 text-xs md:h-9 md:px-4 md:py-2 md:text-sm">
                  메세지
                </CommonButton>
              </>
            )}
          </div>
          <div className="text-end text-xl font-semibold md:text-2xl">{profile.name}</div>
          <div className="text-end text-sm font-medium text-[#737373] dark:text-gray-300 md:text-base">
            {profile.affiliation}
          </div>
          <div className="flex justify-end gap-5">
            <div className="text-xs font-medium md:text-sm">
              <span className="mr-1 md:mr-2">게시글</span>
              <span>{profile.post_count.toLocaleString()}</span>
            </div>
            {/* <div className="text-sm font-medium">
              <span className="mr-2">팔로잉</span>
              <span>{profile.following_count.toLocaleString()}</span>
            </div>
            <div className="text-sm font-medium">
              <span className="mr-2">팔로워</span>
              <span>{profile.follower_count.toLocaleString()}</span>
            </div>
            */}
          </div>
          <p
            ref={pRef}
            className={clsx(
              "w-full text-end text-xs md:max-w-[850px] md:text-sm",
              more ? "line-clamp-none" : "line-clamp-5",
            )}
          >
            {profile.bio.split("\n").map((line: string, index: number) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </p>
          {!more && (
            <button className="ml-auto mr-0 block cursor-pointer text-xs md:text-sm" onClick={(e) => setMore(true)}>
              더보기
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default UserProfile;
