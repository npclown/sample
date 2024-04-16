"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { Event } from "@/lib/definitions";
import { useApplicantList } from "@/store/queries/calendar/event/applicants";
import { useMutation } from "@tanstack/react-query";
import { format, sub } from "date-fns";
import Link from "next/link";
import { forwardRef } from "react";
import { toast } from "react-toastify";

interface Props {
  event: Event;
  refetch: () => void;
}

const OwnerView = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { event, refetch, ...props },
  ref,
) {
  const {
    data: applicant,
    isError,
    isFetched,
    refetch: applicant_refetch,
  } = useApplicantList(event.calendar.name, event.id);

  if (isError) return <></>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updateMutation = useMutation({
    mutationFn: ({ status, id }: { status: string; id: string }) => {
      return request.patch(`/api/calendars/${event.calendar.name}/events/${event.id}/applicants/${id}/manage/`, {
        status: status,
      });
    },
    onSuccess: (response) => {
      refetch();
      applicant_refetch();
      toast.success("처리를 완료했습니다");
    },
    onError: (error) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.message);
    },
  });

  const handleSubmitApplicant = (status: string, id: string) => {
    updateMutation.mutate({ status, id });
  };

  return (
    <Table className="w-[500px] md:w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[70px]">이름</TableHead>
          <TableHead>프로필</TableHead>
          <TableHead>지원시간</TableHead>
          <TableHead>승인하기</TableHead>
          <TableHead className="text-right">거절하기</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isFetched &&
          applicant?.map((applicant) => {
            return (
              <TableRow key={applicant.id}>
                <TableCell className="font-medium">{applicant.user.nickname}</TableCell>
                <TableCell>
                  <Link
                    href={`/portfolio/${applicant.user.profile.profile_url}/`}
                    className="text-ionblue-800 dark:text-ionblue-500"
                  >
                    확인하기
                  </Link>
                </TableCell>
                <TableCell>{format(applicant.created_at, "yyyy-MM-dd HH:mm:ss")}</TableCell>
                <TableCell>
                  {applicant.status == "accept" ? (
                    <Button className="h-5 bg-green-500 dark:bg-green-500">승인됨</Button>
                  ) : (
                    <Button
                      className="h-5 bg-green-500 dark:bg-green-500"
                      onClick={() => {
                        handleSubmitApplicant("accept", applicant.id);
                      }}
                      disabled={applicant.status == "reject" ? true : false}
                    >
                      승인
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {applicant.status == "reject" ? (
                    <Button className="h-5 bg-red-500 dark:bg-red-500">거절됨</Button>
                  ) : (
                    <Button
                      className="h-5 bg-red-500 dark:bg-red-500"
                      onClick={() => {
                        handleSubmitApplicant("reject", applicant.id);
                      }}
                      disabled={applicant.status == "accept" ? true : false}
                    >
                      거절
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
});

OwnerView.displayName = "OwnerView";

export default OwnerView;
