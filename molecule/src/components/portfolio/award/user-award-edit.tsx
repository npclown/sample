"use client";

import request from "@/lib/api/request";
import { formatDateYMD } from "@/lib/utils";
import { useAward } from "@/store/queries/portfolio/portfolio";
import { usePortfolioStore } from "@/store/stores/use-portfolio-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Checkbox } from "../../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import CommonEdit from "../common-edit";
import CommonInput from "../common-input";
import CommonTextarea from "../common-textarea";

const awardFormSchema = z.object({
  // 교육기관
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
  title: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  medal: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  position: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  start_year: z.string(),
  start_month: z.string(),
  end_year: z.string().optional(),
  end_month: z.string().optional(),
  description: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(1000, { message: "1000자를 넘어갈 수 없습니다." }),
  link: z.string().trim().optional(),
});

type AwardFormValues = z.infer<typeof awardFormSchema>;

const defaultValues: Partial<AwardFormValues> = {
  agency: "",
  event: "",
  title: "",
  medal: "",
  position: "",
  description: "",
  link: "",
};

const UserAwardEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const [check, setCheck] = useState(false);
  const { setLoading } = usePortfolioStore();
  const { data: award, isLoading, refetch } = useAward(portfolioId, id ?? "", { enabled: id !== null });
  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createAward = useMutation({
    mutationFn: async ({
      agency,
      event,
      title,
      medal,
      start_date,
      end_date,
      position,
      is_team,
      description,
      links,
    }: {
      agency: string;
      event: string;
      title: string;
      medal: string;
      start_date: string;
      end_date: string;
      position: string;
      is_team: boolean;
      description?: string;
      links: {
        link: string;
      };
    }) => {
      setLoading(true);
      return await request.post("/api/user/portfolio/awards/", {
        agency,
        event,
        title,
        medal,
        start_date,
        end_date,
        position,
        is_team,
        description,
        links,
        is_hidden: false,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("수상 이력 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/award`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const updateAward = useMutation({
    mutationFn: async ({
      agency,
      event,
      title,
      medal,
      start_date,
      end_date,
      position,
      is_team,
      description,
      links,
    }: {
      agency: string;
      event: string;
      title: string;
      medal: string;
      start_date: string;
      end_date: string;
      position: string;
      is_team: boolean;
      description?: string;
      links: {
        link: string;
      };
    }) => {
      setLoading(true);
      return await request.patch(`/api/user/portfolio/awards/${id}/`, {
        agency,
        event,
        title,
        medal,
        start_date,
        end_date,
        position,
        is_team,
        description,
        links,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("수상 이력 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/award`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const deleteAward = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await request.delete(`/api/user/portfolio/awards/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("수상 이력 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/award`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const onSubmit = (data: AwardFormValues) => {
    const result = {
      agency: data.agency,
      event: data.event,
      title: data.title,
      medal: data.medal,
      start_date: formatDateYMD(`${data.start_year}.${data.start_month}.01`),
      end_date: check
        ? formatDateYMD(`${data.start_year}.${data.start_month}.01`)
        : formatDateYMD(`${data.end_year}.${data.end_month}.01`),
      position: data.position,
      is_team: check,
      description: data.description ?? "",
      links: {
        link: data.link ?? "",
      },
    };

    if (id) {
      updateAward.mutate(result);
    } else {
      createAward.mutate(result);
    }
  };

  useEffect(() => {
    if (award) {
      const startDate = award.start_date.split("-");
      const endDate = award.end_date.split("-");

      form.reset({
        ...award,
        start_year: startDate[0],
        start_month: startDate[1],
        end_year: endDate[0],
        end_month: endDate[1],
        link: award.links.link,
      });

      setCheck(award.is_team);
    }
  }, [form, award]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "수상 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/award`}
            deleteClick={() => deleteAward.mutate()}
          >
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"대회명"}
                      require={true}
                      placeholder={"대회명을 입력해주세요."}
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
                      title={"대회 주최/주관"}
                      require={true}
                      placeholder={"대회 주최/주관사를 입력해주세요."}
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
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"시상명"}
                      require={true}
                      placeholder={"시상명을 입력해주세요. 예: 대상, 최우수상"}
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
              name="medal"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"훈격"}
                      placeholder={"훈격을 입력해주세요. 예: 국정원장상, 과기부장관상, 대통령상"}
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
                <span className="text-sm font-semibold md:text-base">대회 기간</span>
                <span className="ml-2 text-[10px] text-[#677489] dark:text-gray-300 md:text-xs">(필수)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex flex-1 gap-1">
                  <FormField
                    control={form.control}
                    name="start_year"
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
                    name="start_month"
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
                                <SelectItem key={month} value={month.toString()}>
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
                </div>

                <div className="flex flex-1 gap-1">
                  <FormField
                    control={form.control}
                    name="end_year"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="종료연도" />
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
                    name="end_month"
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
                                <SelectItem key={month} value={month.toString()}>
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
                </div>
              </div>
            </div>
            <div className="w-full space-y-2">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem className="w-full" aria-disabled="false">
                    <FormControl>
                      <CommonInput
                        title={"역할"}
                        placeholder={"담당한 역할을 작성해주세요. 발표, 분석 등등"}
                        field={field}
                        max={32}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={check} onCheckedChange={(checked: boolean) => setCheck(checked)} />
                <Label
                  htmlFor="terms"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:text-sm"
                >
                  팀 여부
                </Label>
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonTextarea
                      title={"어떤 대회/어떤 역할을 했나요?"}
                      placeholder={
                        "담당한 업무, 프로젝트 및 활동을 입력해주세요. \n\n 예: \n\n - 쇼핑라이브 프론트 지면 개발 \n - 프론트 매시업 api 개발"
                      }
                      tip={"직무와 연관된 교육 내용  및 활동을 입력해주세요."}
                      max={1000}
                      require={true}
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
          </CommonEdit>
        </form>
      </Form>
    </div>
  );
};

export default UserAwardEdit;
