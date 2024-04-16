"use client";

import BannerForm from "@/components/admin/banner/form";
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
import { Banner } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  banner?: Banner;
  mode?: "create" | "edit";
  variant?: "default" | "hidden";
  refetch?: () => void;
}

const BannerFormDialog = forwardRef<{ setOpen: (state: boolean) => void }, React.HTMLProps<HTMLDivElement> & Props>(
  function ({ banner, refetch, mode = "create", variant = "default", ...props }, ref) {
    const [open, setOpen] = useState(false);
    const formRef = useRef<{ handleSubmit: () => void }>(null);

    useImperativeHandle(ref, () => ({
      setOpen: setOpen,
    }));

    const type_text = mode === "create" ? "생성" : "수정";

    const mutation = useMutation({
      mutationFn: () => request.delete(`/api/admin/banners/${banner?.id}/`),
      onSuccess: (response) => {
        setOpen(false);
        refetch && refetch();
        toast.success("배너를 삭제하였습니다");
      },
      onError: (err) => {
        toast.error("배너 삭제에 실패하였습니다");
      },
    });

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {variant !== "hidden" && (
          <DialogTrigger asChild>
            <Button variant="default">배너 {type_text}</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>배너 {type_text}</DialogTitle>
            <DialogDescription>
              {mode === "create" ? <>배너를 생성를 생성합니다</> : <>배너 설정을 수정합니다</>}
            </DialogDescription>
          </DialogHeader>

          <BannerForm ref={formRef} mode={mode} banner={banner} />

          <DialogFooter>
            <AlertDialog>
              {mode !== "create" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600">삭제</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말로 배너를 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>배너가 삭제되면 더 이상 확인할 수 없습니다</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={() => mutation.mutate()}>삭제하기</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialogTrigger asChild>
                <Button type="submit">배너 {type_text}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 {type_text}하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {mode === "create" ? <>배너를 생성하시겠습니까?</> : <>배너를 수정하시겠습니까?</>}
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

BannerFormDialog.displayName = "BannerFormDialog";

export default BannerFormDialog;
