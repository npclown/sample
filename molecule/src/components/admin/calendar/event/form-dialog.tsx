"use client";

import EventForm from "@/components/admin/calendar/event/form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Event } from "@/lib/admin/definitions";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface Props {
  calendar?: string;
  event?: Event;
  mode?: "create" | "edit";
  variant?: "default" | "hidden";
}

const EventFormDialog = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(
  function ({ event, calendar, mode = "create", variant = "default", ...props }, ref) {
    const [open, setOpen] = useState(false);
    const formRef = useRef<{ handleSubmit: () => void }>(null);

    useImperativeHandle(ref, () => ({
      setOpen: setOpen,
    }));

    const type_text = mode === "create" ? "생성" : "수정";

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {variant !== "hidden" && (
            <DialogTrigger asChild>
              <Button variant="default">일정 {type_text}</Button>
            </DialogTrigger>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>일정 {type_text}하기</DialogTitle>
            <DialogDescription>
              {mode === "create" ? <>새로운 {calendar} 일정을 캘린더에 등록합니다</> : <>일정을 수정합니다</>}
            </DialogDescription>
          </DialogHeader>

          <EventForm ref={formRef} mode={mode} event={event} calendar={calendar} />

          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="submit">{type_text}하기</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 {type_text}하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {mode === "create" ? (
                      <>관리자가 생성한 일정은 바로 캘린더에 적용됩니다</>
                    ) : (
                      <>일정을 수정하시겠습니까?</>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      formRef.current?.handleSubmit();
                      setOpen(false);
                    }}
                  >
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

EventFormDialog.displayName = "EventFormDialog";

export default EventFormDialog;
