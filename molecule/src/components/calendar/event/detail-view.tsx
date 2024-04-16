"use client";

import ApplicantDialog from "@/components/calendar/event/applicant/applicant-dialog";
import OwnerDialog from "@/components/calendar/event/applicant/owner-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Event } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { format, sub } from "date-fns";
import Link from "next/link";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Props {
  event: Event;
  refetch: () => void;
}

const EventView = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { event, className, refetch, ...props },
  ref,
) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <hr />

      <div className="flex flex-col gap-2">
        <p>시작일 : {format(event.start, "yyyy-MM-dd HH:mm:ss")}</p>
        <p>종료일 : {format(event.end, "yyyy-MM-dd HH:mm:ss")}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p>참가비 : {event.price}원</p>
        <p>참여방법 : {event.is_online ? "온라인" : "오프라인"}</p>
      </div>

      <div>
        <p>
          팀원 모집 여부 :{" "}
          {event.recruit ? (
            <Badge className="h-5 bg-green-500 dark:bg-green-500">
              {event.recruit.status == "open" ? "모집중" : "모집완료"}
            </Badge>
          ) : (
            <Badge className="h-5 dark:bg-gray-400">모집안함</Badge>
          )}
        </p>
      </div>

      {event.recruit && (
        <div className="flex flex-col gap-2">
          <div>
            <p>모집 인원 : {event.recruit.headcount}명</p>
            <p>제안 eV : {event.recruit.point}eV</p>
          </div>
          <div>
            {event.recruit.applicant_status !== "no_applicant" && (
              <p>
                지원 상태 :{" "}
                {event.recruit.applicant_status == "pending" && (
                  <Badge className="h-5 bg-ionblue-500 dark:bg-ionblue-500">지원함</Badge>
                )}
                {event.recruit.applicant_status == "accept" && (
                  <Badge className="h-5 bg-green-500 dark:bg-green-500">승인됨</Badge>
                )}
                {event.recruit.applicant_status == "reject" && (
                  <Badge className="h-5 bg-red-400 dark:bg-red-400">거절됨</Badge>
                )}
              </p>
            )}

            <p>총 지원자 : {event.recruit.count}명</p>
            <p>
              모집된 지원자 : {event.recruit.accept_count}/{event.recruit.headcount}명
            </p>
          </div>
          <div>{event.owner && <OwnerDialog event={event} refetch={refetch} />}</div>
          <div>
            {!event.owner && event.recruit.applicant_status == "no_applicant" && (
              <ApplicantDialog event={event} refetch={refetch} />
            )}
            {!event.owner && event.recruit.applicant_status == "accept" && (
              <div className="flex flex-col gap-2">
                <p>
                  참가자 전용 안내 메시지{" "}
                  <span className="text-gray-500 dark:text-gray-300">
                    (참가가 승인된 참가자에게만 보이는 안내 메시지입니다)
                  </span>
                </p>
                <Textarea rows={5} className="resize-none" readOnly>
                  {event.recruit.note}
                </Textarea>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <p>카테고리 : {event.calendar.label}</p>
        <p>등록자 : {event.user.nickname}</p>
        <p>
          등록자 프로필 :{" "}
          <Link
            href={`/portfolio/${event.user.profile.profile_url}/`}
            className="text-ionblue-800 dark:text-ionblue-500"
          >
            확인하기
          </Link>
        </p>
      </div>

      <div>
        <Textarea rows={10} className="resize-none" readOnly>
          {event.description}
        </Textarea>
      </div>
    </div>
  );
});

EventView.displayName = "EventForm";

export default EventView;
