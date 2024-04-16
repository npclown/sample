"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { toast } from "react-toastify";

interface Props {
  mode?: "create" | "edit";
  navigation?: Navigation;
}

const NavigationForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { mode = "create", navigation, className, ...props },
  ref,
) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const label = useRef<HTMLInputElement>(null);
  const link = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const order = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: (data: { label: string; link: string; description: string; order: number }) => {
      return request.post("/api/admin/navigations/", {
        label: data.label,
        link: data.link ?? "",
        description: data.description ?? "",
        order: data.order,
      });
    },
    onSuccess: () => {
      toast.success("네비게이션이 생성되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("네이게이션 생성에 실패했습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; label: string; link: string; description: string; order: number }) => {
      return request.patch(`/api/admin/navigations/${data.id}/`, {
        label: data.label,
        link: data.link ?? "",
        description: data.description ?? "",
        order: data.order,
      });
    },
    onSuccess: () => {
      toast.success("네비게이션이 수정되었습니다");
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
            label: label.current!.value,
            link: link.current!.value,
            description: description.current!.value,
            order: parseInt(order.current!.value),
          })
        : updateMutation.mutate({
            id: navigation!.id,
            label: label.current!.value,
            link: link.current!.value,
            description: description.current!.value,
            order: parseInt(order.current!.value),
          }),
  }));

  useEffect(() => {
    if (!navigation) {
      return;
    }

    label.current!.value = navigation.label;
    link.current!.value = navigation.link;
    description.current!.value = navigation.description;
    order.current!.value = navigation.order.toString();
  }, [navigation]);

  return (
    <div className={cn("grid gap-4 py-4", className)} {...props}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="label" className="text-right">
          라벨
        </Label>
        <Input ref={label} id="label" placeholder="네비게이션에 나타낼 문자열입니다" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="link" className="text-right">
          링크
        </Label>
        <Input ref={link} id="link" placeholder="라벨과 연결되는 링크입니다" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          기본 설명
        </Label>
        <Input ref={description} id="description" placeholder="기본적인 설명을 입력해주세요" className="col-span-3" />
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

NavigationForm.displayName = "NavigationForm";

export default NavigationForm;
