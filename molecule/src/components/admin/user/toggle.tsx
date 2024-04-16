"use client";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { useMutation } from "@tanstack/react-query";
import { useId, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function ToggleUser({
  userId,
  stateKey,
  currentState,
  toggleLabel,
  confirmTitleActive,
  confirmTitleInactive,
  confirmDescriptionActive,
  confirmDescriptionInactive,
}: {
  userId: User["id"];
  stateKey: string;
  currentState: boolean;
  toggleLabel: string;
  confirmTitleActive: string;
  confirmTitleInactive: string;
  confirmDescriptionActive: string;
  confirmDescriptionInactive: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(currentState);

  const mutation = useMutation({
    mutationFn: (event) => {
      const data = {
        [stateKey]: !state,
      };

      return request.patch(`/api/admin/users/${userId}/`, data);
    },
    onSuccess: () => {
      setState(!state);
      toast.success("사용자 상태가 변경되었습니다");
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  return (
    <div className="flex items-center space-x-2">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state ? confirmTitleInactive : confirmTitleActive}</AlertDialogTitle>
            <AlertDialogDescription>
              {state ? confirmDescriptionInactive : confirmDescriptionActive}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutation.mutate()}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Switch id={id} checked={state} onCheckedChange={() => setOpen(true)} />
      <Label htmlFor={id}>{toggleLabel}</Label>
    </div>
  );
}
