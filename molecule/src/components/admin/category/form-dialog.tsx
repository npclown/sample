"use client";

import BoardCategoryForm from "@/components/admin/category/form";
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
import { Board, BoardCategory } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  boardCategory?: BoardCategory;
  mode?: "create" | "edit";
  variant?: "default" | "hidden";
  refetch?: () => void;
}

const BoardCategoryFormDialog = forwardRef<
  { setOpen: (state: boolean) => void },
  React.HTMLProps<HTMLDivElement> & Props
>(function ({ boardCategory, refetch, mode = "create", variant = "default", ...props }, ref) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  const mutation = useMutation({
    mutationFn: () => request.delete(`/api/admin/categories/${boardCategory?.id}/`),
    onSuccess: (response) => {
      setOpen(false);
      refetch && refetch();
      toast.success("카테고리를 삭제하였습니다");
    },
    onError: (err) => {
      toast.error("카테고리 삭제에 실패하였습니다");
    },
  });

  useImperativeHandle(ref, () => ({
    setOpen: setOpen,
  }));

  const type_text = mode === "create" ? "생성" : "수정";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {variant !== "hidden" && (
        <DialogTrigger asChild>
          <Button variant="default">게시판 카테고리 {type_text}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시판 카테고리 {type_text}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? (
              <>게시판 카테고리를 생성하면 제거할 수 없습니다</>
            ) : (
              <>게시판 카테고리의 설정을 수정합니다. 게시글은 삭제되지 않습니다</>
            )}
          </DialogDescription>
        </DialogHeader>

        <BoardCategoryForm ref={formRef} mode={mode} boardCategory={boardCategory} />

        <DialogFooter>
          <AlertDialog>
            {mode !== "create" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600">삭제</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말로 카테고리를 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>카테고리가 삭제되면 더 이상 확인할 수 없습니다</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutation.mutate()}>삭제하기</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialogTrigger asChild>
              <Button type="submit">카테고리 {type_text}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 {type_text}하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  {mode === "create" ? (
                    <>게시판 카테고리를 생성 후에는 삭제할 수 없습니다. 게시판 카테고리을 생성하시겠습니까?</>
                  ) : (
                    <>게시판 카테고리 게시판을 수정하시겠습니까?</>
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
});
BoardCategoryFormDialog.displayName = "BoardCategoryFormDialog";

export default BoardCategoryFormDialog;
