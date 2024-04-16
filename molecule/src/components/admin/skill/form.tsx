"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import request from "@/lib/api/request";
import { Skill } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { toast } from "react-toastify";

interface Props {
  mode?: "create" | "edit";
  skill?: Skill;
}

const SkillForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { mode = "create", skill, className, ...props },
  ref,
) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const name = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: (data: { name: string }) => {
      return request.post("/api/portfolio_skills/", {
        name: data.name,
      });
    },
    onSuccess: (response, data) => {
      toast.success("스킬이 생성되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("스킬 생성에 실패했습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string }) => {
      return request.patch(`/api/portfolio_skills/${skill?.id}/`, {
        name: data.name,
      });
    },
    onSuccess: (response, data) => {
      toast.success("스킬이 수정되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("스킬 수정에 실패했습니다");
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: () =>
      mode === "create"
        ? createMutation.mutate({
            name: name.current!.value,
          })
        : updateMutation.mutate({
            name: name.current!.value,
          }),
  }));

  useEffect(() => {
    if (!skill) {
      return;
    }

    name.current!.value = skill.name;
  }, [skill]);

  return (
    <div className={cn("grid gap-4 py-4", className)} {...props}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          스킬명
        </Label>
        <Input ref={name} id="name" placeholder="기술 스텍 이름을 입력해주세요." className="col-span-3" />
      </div>
    </div>
  );
});

SkillForm.displayName = "SkillForm";

export default SkillForm;
