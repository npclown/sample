"use client";

import CalendarForm from "@/components/calendar/form";
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
import { format, sub } from "date-fns";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface Props {
  selectedRange: { start?: Date; end?: Date };
  calendar: string;
}

const CalendarFormDialog = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(
  function ({ selectedRange, calendar, ...props }, ref) {
    const [open, setOpen] = useState(false);
    const formRef = useRef<{ handleSubmit: () => void }>(null);

    useImperativeHandle(ref, () => ({
      setOpen: setOpen,
    }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {Object.keys(selectedRange).length !== 0 && (
            <Button variant="default" className="dark:bg-gray-300">
              {format(selectedRange.start ?? new Date(), "yyyy-MM-dd")} ~{" "}
              {format(sub(selectedRange.end ?? new Date(), { days: 1 }), "yyyy-MM-dd")} 일정 등록하기
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>대회 일정 등록하기</DialogTitle>
            <DialogDescription>새로운 대회 일정을 캘린더에 등록하고 팀을 모집해보세요</DialogDescription>
          </DialogHeader>

          <CalendarForm ref={formRef} selectedRange={selectedRange} calendar={calendar} />

          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="submit">등록하기</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 등록하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    대회 일정과 무관한 일정을 등록할 경우 제재를 받을 수 있습니다.
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
                    등록하기
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

CalendarFormDialog.displayName = "CalendarFormDialog";

export default CalendarFormDialog;
