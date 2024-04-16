"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { Event } from "@/lib/definitions";
import { useMutation } from "@tanstack/react-query";
import { forwardRef } from "react";
import { toast } from "react-toastify";

interface Props {
  event: Event;
  refetch: () => void;
}

const ApplicantDialog = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(
  function ({ event, refetch, ...props }, ref) {
    const createMutation = useMutation({
      mutationFn: () => {
        return request.post(`/api/calendars/${event.calendar.name}/events/${event.id}/applicants/`);
      },
      onSuccess: (response) => {
        refetch();
        toast.success("지원을 완료했습니다, 등록자가 승인하면 알림으로 알려드립니다.");
      },
      onError: (error) => {
        // An error happened!
        const { response } = error as CustomAxiosError;
        toast.error(response.data.data.message);
      },
    });

    const handleSubmitApplicant = () => {
      createMutation.mutate();
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild disabled={event.recruit.status === "close"}>
          <Button className="h-5 bg-ionblue-700">{event.recruit.status === "close" ? "지원마감" : "지원하기"}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>팀원으로 지원하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              일정 등록자가 승인하게되면 {event.recruit.point}eV가 지급됩니다
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSubmitApplicant();
              }}
            >
              지원하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

ApplicantDialog.displayName = "ApplicantDialog";

export default ApplicantDialog;
