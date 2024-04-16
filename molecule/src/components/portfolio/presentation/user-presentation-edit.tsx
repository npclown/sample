"use client";

import request from "@/lib/api/request";
import { formatDateYMD } from "@/lib/utils";
import { usePresentation } from "@/store/queries/portfolio/portfolio";
import { usePortfolioStore } from "@/store/stores/use-portfolio-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import CommonEdit from "../common-edit";
import CommonInput from "../common-input";
import CommonTextarea from "../common-textarea";

const presentationFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  agency: z
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
  location: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  year: z.string(),
  month: z.string(),
  day: z.string(),
  description: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(1000, { message: "1000자를 넘어갈 수 없습니다." }),
  link: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
});

type PresentationFormValues = z.infer<typeof presentationFormSchema>;

const defaultValues: Partial<PresentationFormValues> = {
  title: "",
  agency: "",
  event: "",
  location: "",
  description: "",
  link: "",
  youtube: "",
};

const UserPresentationEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const { setLoading } = usePortfolioStore();
  const {
    data: presentation,
    isLoading,
    refetch,
  } = usePresentation(portfolioId, id ?? "", {
    enabled: id !== null,
  });
  const form = useForm<PresentationFormValues>({
    resolver: zodResolver(presentationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // 생성 / 수정 / 삭제 API 필요
  const createPresentation = useMutation({
    mutationFn: async ({
      title,
      agency,
      event,
      location,
      date,
      description,
      links,
    }: {
      title: string;
      agency: string;
      event: string;
      location: string;
      date: Date | string;
      description: string;
      links: {
        link: string;
        youtube: string;
      };
    }) => {
      setLoading(true);
      return await request.post("/api/user/portfolio/presentations/", {
        title,
        agency,
        event,
        location,
        date,
        description,
        links,
        is_hidden: false,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("발표 이력 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/presentation`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });
  const updatePresentation = useMutation({
    mutationFn: async ({
      title,
      agency,
      event,
      location,
      date,
      description,
      links,
    }: {
      title: string;
      agency: string;
      event: string;
      location: string;
      date: Date | string;
      description: string;
      links: {
        link: string;
        youtube: string;
      };
    }) => {
      setLoading(true);
      return await request.patch(`/api/user/portfolio/presentations/${id}/`, {
        title,
        agency,
        event,
        location,
        date,
        description,
        links,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("발표 이력 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/presentation`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const deletePresentation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await request.delete(`/api/user/portfolio/presentations/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("발표 이력 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/presentation`);
    },
    onError: (error, variables, context) => {
      // An error happened!
      form.reset();
      setLoading(false);
    },
  });

  // 제출 / 수정에 대한 API가 필요
  const onSubmit = (data: PresentationFormValues) => {
    const result = {
      title: data.title,
      agency: data.agency,
      event: data.event,
      location: data.location,
      date: formatDateYMD(`${data.year}.${data.month}.${data.day}`),
      description: data.description ?? "",
      links: {
        link: data.link ?? "",
        youtube: data.youtube ?? "",
      },
    };
    if (id) {
      updatePresentation.mutate(result);
    } else {
      createPresentation.mutate(result);
    }
  };

  useEffect(() => {
    if (presentation) {
      const date = presentation.date.split("-");
      form.reset({
        ...presentation,
        year: date[0],
        month: date[1],
        day: date[2],
        link: presentation.links.link,
        youtube: presentation.links.youtube,
      });
    }
  }, [form, presentation]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "발표 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/presentation`}
            deleteClick={() => deletePresentation.mutate()}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"발표 주제"}
                      require={true}
                      placeholder={"발표 주제를 입력해주세요."}
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
              name="agency"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"발표 주최/주관"}
                      require={true}
                      placeholder={"발표 주최/주관을 입력해주세요."}
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
                      title={"발표 행사명"}
                      require={true}
                      placeholder={"발표 행사명을 입력해주세요."}
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
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"발표 장소"}
                      require={true}
                      placeholder={"발표 장소를 입력해주세요. 예: 라스베가스, 온라인"}
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
                <span className="text-sm font-semibold md:text-base">발표일</span>
                <span className="ml-2 text-[10px] text-[#677489] dark:text-gray-300 md:text-xs">(필수)</span>
              </div>

              <div className="flex flex-1 gap-1">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="시작연도" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => {
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}년
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="월" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                            return (
                              <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                {month}월
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="일" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((month) => {
                            return (
                              <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                {month}일
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonTextarea
                      title={"어떤 내용의 발표인가요?"}
                      placeholder={
                        "담당한 업무, 프로젝트 및 활동을 입력해주세요. \n\n 예: \n\n - 쇼핑라이브 프론트 지면 개발 \n - 프론트 매시업 api 개발"
                      }
                      tip={"상세 내용을 추가하면 제안 확률이 10배 높아져요!"}
                      max={1000}
                      field={field}
                      require={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtube"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"링크 연결 - Youtube"}
                      placeholder={"발표 영상이 있다면 URL을 추가해주세요."}
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
              name="link"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"링크 연결 - 발표자료"}
                      placeholder={"발표 자료가 있다면, URL을 추가해주세요."}
                      field={field}
                      max={256}
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

export default UserPresentationEdit;
