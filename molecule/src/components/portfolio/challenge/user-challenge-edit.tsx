"use client";

import request from "@/lib/api/request";
import { useChallenge } from "@/store/queries/portfolio/portfolio";
import { usePortfolioStore } from "@/store/stores/use-portfolio-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Blob } from "buffer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import CommonEdit from "../common-edit";
import CommonInput from "../common-input";
import CommonTextarea from "../common-textarea";

const challengeFormSchema = z.object({
  // 교육기관
  title: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  type: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  event: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  difficulty: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  keyword: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  description: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(256, { message: "1000자를 넘어갈 수 없습니다." }),
  link: z.string().trim().optional(),
  write: z.string().trim().optional(),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

const defaultValues: Partial<ChallengeFormValues> = {
  title: "",
  type: "",
  event: "",
  difficulty: "",
  keyword: "",
  description: "",
  link: "",
  write: "",
};

const UserChallengeEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const { setLoading } = usePortfolioStore();
  const {
    data: challenge,
    isLoading,
    refetch,
  } = useChallenge(portfolioId, id ?? "", {
    enabled: id !== null,
  });
  const [fileUrl, setFileUrl] = useState<string>("");
  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createChallenge = useMutation({
    mutationFn: async ({
      title,
      type,
      event,
      difficulty,
      keyword,
      description,
      links,
    }: {
      title: string;
      type: string;
      event: string;
      difficulty: string;
      keyword: string;
      description: string;
      links: {
        link: string;
        write: string;
      };
    }) => {
      setLoading(true);
      return await request.post("/api/user/portfolio/challenges/", {
        title,
        type,
        event,
        difficulty,
        keyword,
        description,
        links,
        is_hidden: false,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("문제 출제 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/challenge`);
    },
    onError: (error, variables, context) => {
      // An error happened!
      form.reset();
      setLoading(false);
    },
  });

  const updateChallenge = useMutation({
    mutationFn: async ({
      title,
      type,
      event,
      difficulty,
      keyword,
      description,
      links,
    }: {
      title: string;
      type: string;
      event: string;
      difficulty: string;
      keyword: string;
      description: string;
      links: {
        link: string;
        write: string;
      };
    }) => {
      setLoading(true);
      return await request.patch(`/api/user/portfolio/challenges/${id}/`, {
        title,
        type,
        event,
        difficulty,
        keyword,
        description,
        links,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("문제 출제 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/challenge`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const deleteChallenge = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await request.delete(`/api/user/portfolio/challenges/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("문제 출제 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/challenge`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const fileUpload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file as any, file.name);

      return await request.post("/api/attachments/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (data, variables, context) => {
      setFileUrl(data.data.data.url);
    },
    onError: (error, variables, context) => {
      // An error happened!
      toast.error("파일 업로드 중 오류가 발생했습니다");
    },
  });

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      fileUpload.mutate(file);
    }
  };

  const onSubmit = (data: ChallengeFormValues) => {
    const result = {
      title: data.title,
      type: data.type,
      event: data.event,
      difficulty: data.difficulty,
      keyword: data.keyword,
      links: { link: data.link ?? "", write: fileUrl },
      description: data.description ?? "" ?? "",
    };

    if (id) {
      updateChallenge.mutate(result);
    } else {
      createChallenge.mutate(result);
    }
  };

  useEffect(() => {
    if (challenge) {
      form.reset({
        ...challenge,
        link: challenge.links.link,
        write: challenge.links.write,
      });
      setFileUrl(challenge.links.write);
    }
  }, [form, challenge]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "문제 출제 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/challenge`}
            deleteClick={() => deleteChallenge.mutate()}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"문제 이름"}
                      require={true}
                      placeholder={"문제 이름을 입력해주세요."}
                      field={field}
                      max={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"문제 유형"}
                      require={true}
                      placeholder={"문제 유형을 입력해주세요. (예: 웹, 시스템, 리버싱, 등)"}
                      field={field}
                      max={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"대회명"}
                      require={true}
                      placeholder={"출제한 대회명을 입력해주세요. (예: Dreamhack CTF, Codegate, 등)"}
                      field={field}
                      max={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-semibold md:text-base">난이도</span>
                <span className="ml-2 text-[10px] text-[#677489] dark:text-gray-300 md:text-xs">(필수)</span>
              </div>
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="난이도" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"매우 어려움"}>매우 어려움</SelectItem>
                        <SelectItem value={"어려움"}>어려움</SelectItem>
                        <SelectItem value={"중간"}>중간</SelectItem>
                        <SelectItem value={"쉬움"}>쉬움</SelectItem>
                        <SelectItem value={"매우 쉬움"}>매우 쉬움</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"취약점 키워드"}
                      require={true}
                      placeholder={"사용한 취약점 / 트릭 키워드를 입력해주세요. (예: SQLI, XSS, SSRF 등)"}
                      field={field}
                      max={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"문제 간단 설명"}
                      placeholder={"문제 간단 섦명을 입력해주세요."}
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
              name="link"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"링크 연결"}
                      placeholder={"관련된 웹 사이트가 있다면 URL을 추가해주세요."}
                      field={field}
                      max={256}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="write"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="w-full space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold md:text-base">Write-Up 업로드</span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={"문제에 대한 Write-Up 파일을 업로드 해주세요."}
                        type="file"
                        onChange={onFileUpload}
                      />
                    </FormControl>
                  </div>
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

export default UserChallengeEdit;
