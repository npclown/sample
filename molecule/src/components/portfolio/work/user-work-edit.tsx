"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import request from "@/lib/api/request";
import { Skill } from "@/lib/definitions";
import { formatDateYMD } from "@/lib/utils";
import { useWork } from "@/store/queries/portfolio/portfolio";
import { usePortfolioStore } from "@/store/stores/use-portfolio-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import CommonBadge from "../common-badge";
import CommonEdit from "../common-edit";
import CommonInput from "../common-input";
import CommonTextarea from "../common-textarea";
import PopupSkill from "../skill/popup-skill";

const workFormSchema = z.object({
  // 회사명
  company: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  // 직책
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

type WorkFormValues = z.infer<typeof workFormSchema>;

const defaultValues: Partial<WorkFormValues> = {
  company: "",
  position: "",
  description: "",
  link: "",
};

const UserWorkEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const [check, setCheck] = useState(false);
  const { setLoading } = usePortfolioStore();
  const { data: work, refetch } = useWork(portfolioId, id ?? "", {
    enabled: id !== null,
  });
  const [selectedSkill, setSelectedSkill] = useState([]);
  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createWork = useMutation({
    mutationFn: async ({
      company,
      position,
      start_date,
      end_date,
      is_current,
      description,
      links,
      skills,
    }: {
      company: string;
      position: string;
      start_date: string;
      end_date: string;
      is_current: boolean;
      description: string;
      links: {
        link: string;
      };
      skills: [];
    }) => {
      setLoading(true);
      return await request.post("/api/user/portfolio/experiences/", {
        company,
        position,
        start_date,
        end_date,
        is_current,
        description,
        links,
        skills,
        is_hidden: false,
        type: "work",
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("경력 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/experience`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const updateWork = useMutation({
    mutationFn: async ({
      company,
      position,
      start_date,
      end_date,
      is_current,
      description,
      links,
      skills,
    }: {
      company: string;
      position: string;
      start_date: string;
      end_date: string;
      is_current: boolean;
      description: string;
      links: {
        link: string;
      };
      skills: [];
    }) => {
      setLoading(true);
      return await request.patch(`/api/user/portfolio/experiences/${id}/`, {
        company,
        position,
        start_date,
        end_date,
        is_current,
        description,
        links,
        skills,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("경력 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/experience`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const deleteWork = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await request.delete(`/api/user/portfolio/experiences/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("경력 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/experience`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const onSubmit = (data: WorkFormValues) => {
    const result = {
      company: data.company,
      position: data.position,
      start_date: formatDateYMD(`${data.start_year}.${data.start_month}.01`),
      end_date: check
        ? formatDateYMD(`${data.start_year}.${data.start_month}.01`)
        : formatDateYMD(`${data.end_year}.${data.end_month}.01`),
      is_current: check,
      description: data.description ?? "",
      links: { link: data.link ?? "" },
      skills: selectedSkill.map((value: Skill) => value.id).sort(),
    };

    if (id) {
      // @ts-ignore
      updateWork.mutate(result);
    } else {
      // @ts-ignore
      createWork.mutate(result);
    }
  };

  useEffect(() => {
    if (work) {
      const startDate = work.start_date.split("-");
      const endDate = work.end_date.split("-");

      form.reset({
        ...work,
        start_year: startDate[0],
        start_month: startDate[1],
        end_year: endDate[0],
        end_month: endDate[1],
        link: work.links.link,
      });
      setCheck(work.is_current);
      setSelectedSkill(work.skills);
    }
  }, [form, work]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "경력 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/experience`}
            deleteClick={() => deleteWork.mutate()}
          >
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"소속"}
                      require={true}
                      placeholder={"팀, 조직, 회사명 등을 입력해주세요."}
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
              name="position"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"직함"}
                      require={true}
                      placeholder={"직함을 입력해주세요. 예: 프로덕트 매니저"}
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
                <span className="text-sm font-semibold md:text-base">재직 기간</span>
                <span className="ml-2 text-[10px] text-[#677489] dark:text-gray-300 md:text-xs">(필수)</span>
              </div>
              <div className="flex items-center gap-2">
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
                  재직중
                </Label>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-semibold md:text-base">스킬</span>
              </div>
              {selectedSkill.length == 0 ? (
                <PopupSkill
                  portfolioId={portfolioId}
                  selectedSkill={selectedSkill}
                  setSelectedSkill={setSelectedSkill}
                />
              ) : (
                <>
                  <div className="ml-0 mr-auto flex flex-wrap items-center justify-start gap-2">
                    {selectedSkill.map((value: Skill) => {
                      return (
                        <CommonBadge className="bg-[#F2F5F9] px-4" key={value.id}>
                          <span className="text-xs font-medium text-[#677489] md:text-sm">{value.name}</span>
                        </CommonBadge>
                      );
                    })}
                  </div>
                  <PopupSkill
                    portfolioId={portfolioId}
                    selectedSkill={selectedSkill}
                    setSelectedSkill={setSelectedSkill}
                  />
                </>
              )}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonTextarea
                      title={"어떤 일을 했나요?"}
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

export default UserWorkEdit;
