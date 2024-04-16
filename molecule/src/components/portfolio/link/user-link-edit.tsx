"use client";

import request from "@/lib/api/request";
import { useLink } from "@/store/queries/portfolio/portfolio";
import { usePortfolioStore } from "@/store/stores/use-portfolio-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import CommonEdit from "../common-edit";
import CommonInput from "../common-input";

const linkFormSchema = z.object({
  url: z
    .string()
    .trim()
    .regex(/https?:\/\/[^\s]+/g, {
      message: "https url만 가능합니다.",
    })
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(256, { message: "256자를 넘어갈 수 없습니다." }),
  name: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

const defaultValues: Partial<LinkFormValues> = {
  url: "",
  name: "",
};

const UserLinkEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const { data: link, refetch } = useLink(portfolioId, id ?? "");
  const { setLoading } = usePortfolioStore();

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createLink = useMutation({
    mutationFn: async ({ name, url }: { name: string; url: string }) => {
      setLoading(true);
      return await request.post("/api/user/portfolio/links/", { name, url });
    },
    onSuccess: (data, variables, context) => {
      toast.success("링크 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/profile`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const updateLink = useMutation({
    mutationFn: async ({ name, url }: { name: string; url: string }) => {
      setLoading(true);
      return await request.patch(`/api/user/portfolio/links/${id}/`, { name, url });
    },
    onSuccess: (data, variables, context) => {
      toast.success("링크 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/profile`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const deleteLink = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await request.delete(`/api/user/portfolio/links/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("링크 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/profile`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const onSubmit = (data: LinkFormValues) => {
    if (id) {
      updateLink.mutate(data);
    } else {
      createLink.mutate(data);
    }
  };

  useEffect(() => {
    if (link) {
      form.reset(link);
    }
  }, [link, form]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "링크 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/profile`}
            deleteClick={() => deleteLink.mutate()}
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"링크"}
                      require={true}
                      placeholder={"URL을 입력해주세요."}
                      max={256}
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"이름"}
                      require={true}
                      placeholder={"링크를 대신하여 표현될 텍스트를 입력해주세요. (예: 포트폴리오)"}
                      field={field}
                      max={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CommonEdit>
        </form>
      </Form>
    </div>
  );
};

export default UserLinkEdit;
