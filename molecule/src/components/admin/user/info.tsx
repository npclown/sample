"use client";

import ToggleUser from "@/components/admin/user/toggle";
import { DistanceTime, FormattedTime } from "@/components/time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import { capitalize, copyToClipboard } from "@/lib/utils";
import { useUser } from "@/store/queries/admin/user/user";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function UserInfo({ userId }: { userId: User["id"] }) {
  const { data, error } = useUser(userId);

  if (error) {
    toast.error(parseError(error).message);
    return <></>;
  }
  if (!data) {
    return <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">place skeleton here</div>;
  }

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <div className="flex items-center justify-start gap-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={data.profile?.image_url} />
          <AvatarFallback>Ion</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-0.5">
          <span className="select-all">{data.nickname}</span>
          <span className="select-all font-mono text-xs">{data.email}</span>
          <div className="flex items-center gap-1">
            {data.is_superuser ? <Badge>최고관리자</Badge> : data.is_staff ? <Badge>운영자</Badge> : <></>}
            {!data.is_active && <Badge variant="destructive">정지됨</Badge>}
            <Badge variant={`level-${data.profile.level}`}>{capitalize(data.profile.level)}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-y-4">
        <span className="text-gray-600 dark:text-gray-300">ID</span>
        <span className="col-span-3 flex items-center gap-2">
          <span className="select-all font-mono">{data.id}</span>
          <ClipboardDocumentListIcon
            className="h-4 w-4 cursor-pointer transition hover:text-ionblue-500"
            onClick={() => copyToClipboard(data.id.toString())}
          />
        </span>

        <span className="text-gray-600 dark:text-gray-300">가입일</span>
        <span className="col-span-3 flex items-center gap-2 font-mono">
          {data.created_at === null ? (
            "정보 없음"
          ) : (
            <>
              <FormattedTime time={data.created_at} />
              <span>
                (<DistanceTime time={data.created_at} />)
              </span>
            </>
          )}
        </span>

        <span className="text-gray-600 dark:text-gray-300">마지막 활동</span>
        <span className="col-span-3 flex gap-2 font-mono">
          {data.last_active_at === null ? (
            "정보 없음"
          ) : (
            <>
              <FormattedTime time={data.last_active_at} />
              <span>
                (<DistanceTime time={data.last_active_at} />)
              </span>
            </>
          )}
        </span>

        <span className="text-gray-600 dark:text-gray-300">전체 eV</span>
        <span className="col-span-3 flex gap-2 font-mono">{data.points.point.toLocaleString()} eV</span>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center gap-4">
        <ToggleUser
          userId={userId}
          stateKey="is_active"
          currentState={data.is_active}
          toggleLabel="활성화"
          confirmTitleActive="정말로 활성화 하시겠습니까?"
          confirmTitleInactive="정말로 비활성화 하시겠습니까?"
          confirmDescriptionActive="해당 회원을 활성화 하시겠습니까? 활성화 후 해당 회원은 서비스를 다시 이용할 수 있습니다."
          confirmDescriptionInactive="해당 회원을 비활성화 하시겠습니까? 비활성화 후 해당 회원은 서비스를 이용할 수 없습니다."
        />

        <ToggleUser
          userId={userId}
          stateKey="is_staff"
          currentState={data.is_staff}
          toggleLabel="운영자"
          confirmTitleActive="운영자로 지정하시겠습니까?"
          confirmTitleInactive="운영자 지정을 해제하시겠습니까?"
          confirmDescriptionActive="해당 회원을 운영자로 지정하시겠습니까? 운영자로 지정 후 해당 회원은 관리자 페이지에 접근할 수 있습니다."
          confirmDescriptionInactive="해당 회원의 운영자 지정을 해제하시겠습니까? 운영자 지정 해제 후 해당 회원은 관리자 페이지에 접근할 수 없습니다."
        />
      </div>
    </div>
  );
}
