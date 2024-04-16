"use client";

import EventView from "@/components/calendar/event/detail-view";
import EditForm from "@/components/calendar/event/edit-form";
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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import request from "@/lib/api/request";
import { Event } from "@/lib/definitions";
import { useEvent } from "@/store/queries/calendar/event/event";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  event: Event;
  open: boolean;
  setOpen: (state: boolean) => void;
  refetch: () => void;
}

const EventDetailDialog = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(
  function ({ event, open, setOpen, refetch, ...props }, ref) {
    const { data: custom_event, isFetched, refetch: event_refetch } = useEvent(event.calendar.name, event.id);
    const formRef = useRef<{ handleSubmit: () => void }>(null);

    const [editOpen, setEditOpen] = useState(false);

    const eventDelete = useMutation({
      mutationFn: () => request.delete(`/api/calendars/${event.calendar.name}/events/${event.id}/`),
      onSuccess: (response) => {
        setOpen(false);
        refetch();
        toast.success("일정을 삭제하였습니다");
      },
      onError: (err) => {
        toast.error("일정 삭제에 실패하였습니다");
      },
    });

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={!editOpen ? "xl:min-w-[1000px]" : ""}>
          <DialogHeader>
            <DialogTitle>{editOpen ? `${event.title} 일정 수정` : `${event.title} 상세 일정 확인`}</DialogTitle>
          </DialogHeader>

          {isFetched && !editOpen && <EventView event={custom_event!} refetch={event_refetch} />}
          {editOpen && <EditForm ref={formRef} event={custom_event!} />}

          <DialogFooter>
            {event.owner && !editOpen && (
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setEditOpen(true)}
                  className="bg-ionblue-500 hover:bg-ionblue-600 dark:bg-ionblue-500 dark:hover:bg-ionblue-600"
                >
                  수정
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600">삭제</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말로 일정을 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        일정이 삭제되면 더 이상 캘린더에서 확인할 수 없습니다
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={() => eventDelete.mutate()}>삭제하기</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <DialogClose>
                  <Button type="submit">닫기</Button>
                </DialogClose>
              </div>
            )}

            {event.owner && editOpen && (
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    formRef.current?.handleSubmit();
                    setEditOpen(false);
                    setOpen(false);
                  }}
                  className="bg-ionblue-500 hover:bg-ionblue-600 dark:bg-ionblue-500 dark:hover:bg-ionblue-600"
                >
                  수정하기
                </Button>
                <DialogClose>
                  <Button type="submit">닫기</Button>
                </DialogClose>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

EventDetailDialog.displayName = "EventDetailDialog";

export default EventDetailDialog;
