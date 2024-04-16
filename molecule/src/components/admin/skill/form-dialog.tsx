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
import request from "@/lib/api/request";
import { Skill } from "@/lib/definitions";
import { useMutation } from "@tanstack/react-query";
import { truncate } from "fs/promises";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

import SkillForm from "./form";

interface Props {
  skill?: Skill;
  mode?: "create" | "edit";
  variant?: "default" | "hidden";
  refetch?: () => void;
}

const SkillFormDialog = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(
  function ({ skill, refetch, mode = "create", variant = "default", ...props }, ref) {
    const [open, setOpen] = useState(false);
    const formRef = useRef<{ handleSubmit: () => void }>(null);

    const mutation = useMutation({
      mutationFn: () => request.delete(`/api/portfolio_skills/${skill?.id}/`),
      onSuccess: (response) => {
        setOpen(false);
        refetch && refetch();
        toast.success("스킬을 삭제하였습니다");
      },
      onError: (err) => {
        toast.error("스킬 삭제에 실패하였습니다");
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
            <Button variant="default">스킬 {type_text}</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스킬 {type_text}</DialogTitle>
            <DialogDescription>
              {mode === "create" ? <>스킬을 생성합니다.</> : <>스킬을 수정합니다.</>}
            </DialogDescription>
          </DialogHeader>

          <SkillForm ref={formRef} mode={mode} skill={skill} />

          <DialogFooter>
            <AlertDialog>
              {mode !== "create" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600">삭제</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말로 스킬을 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>스킬이 삭제되면 더 이상 확인할 수 없습니다</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={() => mutation.mutate()}>삭제하기</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialogTrigger asChild>
                <Button type="submit">스킬 {type_text}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 {type_text}하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {mode === "create" ? <>스킬을 생성하시겠습니까?</> : <>스킬 게시판을 수정하시겠습니까?</>}
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
SkillFormDialog.displayName = "SkillFormDialog";

export default SkillFormDialog;
