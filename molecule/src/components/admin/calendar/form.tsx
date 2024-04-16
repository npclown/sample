"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  mode?: "create" | "edit";
  calendar?: Calendar;
}

const CalendarForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { mode = "create", calendar, className, ...props },
  ref,
) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const name = useRef<HTMLInputElement>(null);
  const label = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const order = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: (data: { name: string; label: string; description: string; order: number }) => {
      return request.post("/api/admin/calendars/", {
        name: data.name,
        label: data.label,
        description: data.description ?? "",
        order: data.order,
      });
    },
    onSuccess: (response, data) => {
      toast.success("캘린더가 생성되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("캘린더 생성에 실패했습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; label: string; description: string; order: number }) => {
      return request.patch(`/api/admin/calendars/${data.name}/`, {
        name: data.name,
        label: data.label,
        description: data.description ?? "",
        order: data.order,
      });
    },
    onSuccess: (response, data) => {
      toast.success("캘린더가 수정되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: () =>
      mode === "create"
        ? createMutation.mutate({
            name: name.current!.value,
            label: label.current!.value,
            description: description.current!.value,
            order: parseInt(order.current!.value),
          })
        : updateMutation.mutate({
            id: calendar!.id,
            name: name.current!.value,
            label: label.current!.value,
            description: description.current!.value,
            order: parseInt(order.current!.value),
          }),
  }));

  useEffect(() => {
    if (!calendar) {
      return;
    }

    name.current!.value = calendar.name;
    label.current!.value = calendar.label;
    description.current!.value = calendar.description;
    order.current!.value = calendar.order.toString();
  }, [calendar]);

  return (
    <div className={cn("grid gap-4 py-4", className)} {...props}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          이름
        </Label>
        <Input ref={name} id="name" placeholder="URL에 포함되는 문자열입니다" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="label" className="text-right">
          라벨
        </Label>
        <Input ref={label} id="label" placeholder="실제로 유저들에게 표시되는 이름입니다" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          설명
        </Label>
        <Input ref={description} id="description" placeholder="캘린더의 설명을 입력해주세요" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="order" className="text-right">
          정렬 순서
        </Label>
        <Input
          ref={order}
          id="order"
          placeholder="숫자가 낮을수록 앞에 배치됩니다"
          className="col-span-3"
          type="number"
          inputMode="numeric"
        />
      </div>
    </div>
  );
});

CalendarForm.displayName = "CalendarForm";

export default CalendarForm;
