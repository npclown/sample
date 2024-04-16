"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Role } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { useRole } from "@/store/queries/admin/role/role";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const NullableFormString = z.preprocess((v) => (v === "null" ? null : v), z.string().nullish());

const roleFormSchema = z.object({
  id: z.string().readonly(),
  name: z.string().trim(),
  description: z.string().trim(),
  level: NullableFormString,
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

const defaultValues: Partial<RoleFormValues> = {
  id: "",
  name: "",
  description: "",
  level: "null",
};

export default function RoleForm({ mode = "edit", roleId }: { mode?: "create" | "edit"; roleId?: Role["id"] }) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const router = useRouter();

  const { data: role, error } = useRole(mode, roleId!);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createMutation = useMutation({
    mutationFn: (data: RoleFormValues) => {
      return request.post("/api/admin/roles/", {
        name: data.name,
        description: data.description ?? "",
        level: data.level,
      });
    },
    onSuccess: (response) => {
      toast.success("역할이 생성되었습니다");
      toggleReload();
      router.replace(`/conductor/role/${response.data.data.id}`);
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: RoleFormValues) => {
      return request.patch(`/api/admin/roles/${roleId}/`, {
        name: data.name,
        description: data.description ?? "",
        level: data.level,
      });
    },
    onSuccess: () => {
      toast.success("역할이 수정되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  const handleSubmit = (data: RoleFormValues) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (!role) {
      return;
    }

    form.reset(role);
  }, [form, role]);

  if (error) {
    toast.error(parseError(error).message);
    return <></>;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <div className="flex flex-col px-4">
        {mode === "create" ? (
          <>
            <span className="text-lg font-bold">역할 생성</span>
            <span>새로운 역할을 생성합니다</span>
          </>
        ) : (
          <>
            <span className="text-lg font-bold">{role?.name}</span>
            <span>{role?.description}</span>
          </>
        )}
      </div>

      <Separator className="mt-4" />

      <Form {...form}>
        <form className="flex flex-col gap-4 p-4" onSubmit={form.handleSubmit(handleSubmit)}>
          {mode === "edit" && (
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>등급</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="null" value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="해당 등급에게 자동으로 할당됩니다" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="null">미지정</SelectItem>
                      <SelectItem value="novice">Novice</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                      <SelectItem value="moderator">SC: Space Connector</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button type="submit" className="dark:bg-gray-300 hover:dark:bg-gray-400">
            저장
          </Button>
        </form>
      </Form>
    </div>
  );
}
