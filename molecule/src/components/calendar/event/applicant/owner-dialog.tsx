"use client";

import OwnerView from "@/components/calendar/event/applicant/owner-view";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/definitions";
import { forwardRef } from "react";

interface Props {
  event: Event;
  refetch: () => void;
}

const OwnerDialog = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(
  function ({ event, refetch, ...props }, ref) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="h-5 bg-ionblue-700">지원자 확인하기</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="md:min-w-[700px] xl:min-w-[900px]">
          <AlertDialogHeader>
            <AlertDialogTitle>지원자 확인</AlertDialogTitle>
            <AlertDialogDescription>원하는 지원자를 선택하고 팀을 구성하세요</AlertDialogDescription>
          </AlertDialogHeader>

          <OwnerView event={event} refetch={refetch} />

          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

OwnerDialog.displayName = "OwnerDialog";

export default OwnerDialog;
