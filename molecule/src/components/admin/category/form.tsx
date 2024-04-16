"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Board, BoardCategory, BoardCategoryPoint, BoardPoint } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { useBoardList } from "@/store/queries/admin/board/boards";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  mode?: "create" | "edit";
  boardCategory?: BoardCategory;
}

const BoardCategoryForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { mode = "create", boardCategory, className, ...props },
  ref,
) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const [board, setBoard] = useState<string>("");
  const name = useRef<HTMLInputElement>(null);
  const label = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const order = useRef<HTMLInputElement>(null);

  const [writePoint, setWritePoint] = useState<string>("");
  const [likePoint, setLikePoint] = useState<string>("");
  const [likeCount, setLikeCount] = useState<string>("");

  const { data: boardList, error } = useBoardList(1);

  const createMutation = useMutation({
    mutationFn: (data: {
      name: string;
      label: string;
      description: string;
      board: string;
      order: number;
      category_point: BoardCategoryPoint;
    }) => {
      return request.post("/api/admin/categories/", {
        name: data.name,
        label: data.label,
        description: data.description ?? "",
        board: data.board,
        order: data.order,
        category_point: data.category_point,
      });
    },
    onSuccess: (response, data) => {
      toast.success("게시판 카테고리가 생성되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("게시판 카테고리 생성에 실패했습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      label: string;
      description: string;
      board: string;
      order: number;
      category_point: BoardCategoryPoint;
    }) => {
      return request.patch(`/api/admin/categories/${data.id}/`, {
        name: data.name,
        label: data.label,
        description: data.description ?? "",
        board: data.board,
        order: data.order,
        category_point: data.category_point,
      });
    },
    onSuccess: (response, data) => {
      updatePointMutation.mutate({
        id: data.id,
        like_point: data.category_point.like_point,
        write_point: data.category_point.write_point,
        like_count: data.category_point.like_count,
      });
      toast.success("게시판 카테고리가 수정되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  const updatePointMutation = useMutation({
    mutationFn: (data: { id: string; write_point: string; like_point: string; like_count: string }) => {
      return request.patch(`/api/admin/categories/${data.id}/point/`, {
        write_point: data.write_point,
        like_point: data.like_point,
        like_count: data.like_count,
      });
    },
    onSuccess: (response, data) => {
      toast.success("게시판 카테고리 포인트가 수정되었습니다");
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
            board: board,
            category_point: {
              write_point: writePoint,
              like_point: likePoint,
              like_count: likeCount,
            },
          })
        : updateMutation.mutate({
            id: boardCategory!.id,
            name: name.current!.value,
            label: label.current!.value,
            description: description.current!.value,
            order: parseInt(order.current!.value),
            board: board,
            category_point: {
              write_point: writePoint,
              like_point: likePoint,
              like_count: likeCount,
            },
          }),
  }));

  useEffect(() => {
    if (!boardCategory) {
      return;
    }

    name.current!.value = boardCategory.name;
    label.current!.value = boardCategory.label;
    description.current!.value = boardCategory.description;
    order.current!.value = boardCategory.order.toString();

    setWritePoint(boardCategory.category_point.write_point != "0" ? boardCategory.category_point.write_point : "0");
    setLikePoint(boardCategory.category_point.like_point != "0" ? boardCategory.category_point.like_point : "0");
    setLikeCount(boardCategory.category_point.like_count != "0" ? boardCategory.category_point.like_count : "0");
    setBoard(boardCategory.board.id);
  }, [boardCategory]);

  return (
    <div className={cn("grid gap-4 py-4", className)} {...props}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          게시판
        </Label>
        <Select onValueChange={(value) => setBoard(value)} defaultValue="null" value={board || undefined}>
          <SelectTrigger className="col-start-2 col-end-5">
            <SelectValue placeholder="게시판을 선택해주세요." />
          </SelectTrigger>

          <SelectContent>
            {boardList?.data.map((value) => {
              return (
                <SelectItem key={value.id} value={value.id}>
                  {value.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
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
        <Label htmlFor="default_point" className="text-right">
          기본 포인트
        </Label>
        <Input
          value={writePoint}
          onChange={(e) => setWritePoint(e.target.value)}
          id="default_point"
          placeholder="게시판에 글을 작성하면 얻는 포인트입니다"
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="bonus_point" className="text-right">
          추가 포인트
        </Label>
        <Input
          value={likePoint}
          onChange={(e) => setLikePoint(e.target.value)}
          id="bonus_point"
          placeholder="특정 좋아요 기준을 달성하면 얻는 포인트입니다"
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="like_condition" className="text-right">
          기준 좋아요 수
        </Label>
        <Input
          value={likeCount}
          onChange={(e) => setLikeCount(e.target.value)}
          id="like_condition"
          placeholder="추가 포인트를 받을 수 있는 기준 좋아요 수 입니다"
          className="col-span-3"
        />
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

BoardCategoryForm.displayName = "BoardCategoryForm";

export default BoardCategoryForm;
