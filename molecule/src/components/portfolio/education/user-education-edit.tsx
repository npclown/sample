"use client";

import request from "@/lib/api/request";
import { formatDateYMD } from "@/lib/utils";
import { useEducation } from "@/store/queries/portfolio/portfolio";
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

const educationFormSchema = z.object({
  // 교육기관
  agency: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  major: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "40자를 넘어갈 수 없습니다." }),
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

type EducationFormValues = z.infer<typeof educationFormSchema>;

const defaultValues: Partial<EducationFormValues> = {
  agency: "",
  major: "",
  description: "",
  link: "",
};

const UserEducationEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const [check, setCheck] = useState(false);
  const { setLoading } = usePortfolioStore();
  const { data: education, refetch } = useEducation(portfolioId, id ?? "", {
    enabled: id !== null,
  });
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createEducation = useMutation({
    mutationFn: async ({
      agency,
      major,
      start_date,
      end_date,
      is_current,
      description,
      links,
    }: {
      agency: string;
      major: string;
      start_date: string;
      end_date: string;
      is_current: boolean;
      description: string;
      links: {
        link: string;
      };
    }) => {
      setLoading(true);
      return await request.post("/api/user/portfolio/educations/", {
        agency,
        major,
        start_date,
        end_date,
        is_current,
        description,
        links,
        is_hidden: false,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("교육이력 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/education`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const updateEducation = useMutation({
    mutationFn: async ({
      agency,
      major,
      start_date,
      end_date,
      is_current,
      description,
      links,
    }: {
      agency: string;
      major: string;
      start_date: string;
      end_date: string;
      is_current: boolean;
      description: string;
      links: {
        link: string;
      };
    }) => {
      setLoading(true);
      return await request.patch(`/api/user/portfolio/educations/${id}/`, {
        agency,
        major,
        start_date,
        end_date,
        is_current,
        description,
        links,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("교육이력 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/education`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const deleteEducation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await request.delete(`/api/user/portfolio/educations/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("교육이력 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/education`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const onSubmit = (data: EducationFormValues) => {
    const result = {
      agency: data.agency,
      major: data.major,
      start_date: formatDateYMD(`${data.start_year}.${data.start_month}.01`),
      end_date: check
        ? formatDateYMD(`${data.start_year}.${data.start_month}.01`)
        : formatDateYMD(`${data.end_year}.${data.end_month}.01`),
      is_current: check,
      links: { link: data.link ?? "" },
      description: data.description ?? "",
    };

    if (id) {
      updateEducation.mutate(result);
    } else {
      createEducation.mutate(result);
    }
  };

  useEffect(() => {
    if (education) {
      const startDate = education.start_date.split("-");
      const endDate = education.end_date.split("-");

      form.reset({
        ...education,
        start_year: startDate[0],
        start_month: startDate[1],
        end_year: endDate[0],
        end_month: endDate[1],
        link: education.links.link,
      });
      setCheck(education.is_current);
    }
  }, [form, education]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "교육 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/education`}
            deleteClick={() => deleteEducation.mutate()}
          >
            <FormField
              control={form.control}
              name="agency"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"교육 주최/주관"}
                      require={true}
                      placeholder={"학교명, 교육 프로그램 등을 입력해주세요"}
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
              name="major"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"전공/과정"}
                      require={true}
                      placeholder={"전공/과정을 입력해주세요. 예: 웹 개발 과정"}
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
                <span className="text-sm font-semibold md:text-base">교육 기간</span>
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
                </div>
                {check ? (
                  <div className="inline-flex h-[36px] w-1/2 flex-none items-center justify-center rounded-md bg-[#F2F5F9] px-2 text-sm font-medium text-[#101729] md:text-base">
                    현재
                  </div>
                ) : (
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
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={check} onCheckedChange={(checked: boolean) => setCheck(checked)} />
                <Label
                  htmlFor="terms"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:text-sm"
                >
                  재학중
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
                      title={"어떤 활동을 했나요?"}
                      placeholder={
                        "담당한 업무, 프로젝트 및 활동을 입력해주세요. \n\n 예: \n\n - 쇼핑라이브 프론트 지면 개발 \n - 프론트 매시업 api 개발"
                      }
                      tip={"직무와 연관된 교육 내용  및 활동을 입력해주세요."}
                      require={true}
                      max={1000}
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

export default UserEducationEdit;
