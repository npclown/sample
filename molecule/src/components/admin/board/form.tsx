"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Board, BoardPoint } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  mode?: "create" | "edit";
  board?: Board;
}

const BoardForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { mode = "create", board, className, ...props },
  ref,
) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const name = useRef<HTMLInputElement>(null);
  const label = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<Board["type"]>(board?.type ?? "post");
  const [is_main, setIsMain] = useState<boolean>(board?.is_main ?? false);
  const order = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Board>) => {
      return request.post("/api/admin/boards/", {
        name: data.name,
        label: data.label,
        description: data.description ?? "",
        type: data.type,
        is_main: data.is_main,
        order: data.order,
      });
    },
    onSuccess: (response, data) => {
      toast.success("게시판이 생성되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("게시판 생성에 실패했습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Board>) => {
      return request.patch(`/api/admin/boards/${data.id}/`, {
        name: data.name,
        label: data.label,
        description: data.description ?? "",
        type: data.type,
        is_main: data.is_main,
        order: data.order,
      });
    },
    onSuccess: (response, data) => {
      toast.success("게시판이 수정되었습니다");
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
            type,
            is_main,
            order: parseInt(order.current!.value),
          })
        : updateMutation.mutate({
            id: board!.id,
            name: name.current!.value,
            label: label.current!.value,
            description: description.current!.value,
            type,
            is_main,
            order: parseInt(order.current!.value),
          }),
  }));

  useEffect(() => {
    if (!board) {
      return;
    }

    name.current!.value = board.name;
    label.current!.value = board.label;
    description.current!.value = board.description;
    setType(board.type);
    setIsMain(board.is_main);
    order.current!.value = board.order.toString();
  }, [board]);

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
        <Input ref={description} id="description" placeholder="게시판의 설명을 입력해주세요" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          유형
        </Label>
        <RadioGroup
          value={type}
          onValueChange={(value: Board["type"]) => {
            setType(value);
          }}
          className="col-span-3 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="post" id="type_post" />
            <Label htmlFor="type_post">일반 게시판</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="question" id="type_question" />
            <Label htmlFor="type_question">질문 게시판</Label>
          </div>
        </RadioGroup>
      </div>

      {type !== "question" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            메인페이지 노출
          </Label>
          <RadioGroup
            value={is_main ? "main" : "unmain"}
            onValueChange={(value: string) => {
              setIsMain(value === "main" ? true : false);
            }}
            className="col-span-3 flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="main" id="type_main" />
              <Label htmlFor="type_main">노출</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unmain" id="type_unmain" />
              <Label htmlFor="type_unmain">비노출</Label>
            </div>
          </RadioGroup>
        </div>
      )}

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

BoardForm.displayName = "BoardForm";

export default BoardForm;
