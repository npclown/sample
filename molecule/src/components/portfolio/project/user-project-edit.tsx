"use client";

import request from "@/lib/api/request";
import { formatDateYMD } from "@/lib/utils";
import { useProject } from "@/store/queries/portfolio/portfolio";
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

const projectFormSchema = z.object({
  // 교육기관
  title: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(32, { message: "32자를 넘어갈 수 없습니다." }),
  achievement: z
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
  contribution: z.string().trim().max(1000, { message: "1000자를 넘어갈 수 없습니다." }).optional(),
  description: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(1000, { message: "1000자를 넘어갈 수 없습니다." }),
  link: z.string().trim().optional(),
  github: z.string().trim().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const defaultValues: Partial<ProjectFormValues> = {
  title: "",
  achievement: "",
  position: "",
  contribution: "",
  description: "",
  link: "",
  github: "",
};

const UserProjectEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const [check, setCheck] = useState(false);
  const { setLoading } = usePortfolioStore();
  const { data: project } = useProject(portfolioId, id ?? "", {
    enabled: id !== null,
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createProject = useMutation({
    mutationFn: async ({
      title,
      achievement,
      is_team,
      position,
      start_date,
      end_date,
      contribution,
      description,
      links,
    }: {
      title: string;
      achievement: string;
      is_team: boolean;
      position: string;
      start_date: string;
      end_date: string;
      contribution: string;
      description: string;
      links: {
        link: string;
        github: string;
      };
    }) => {
      setLoading(true);
      return await request.post("/api/user/portfolio/projects/", {
        title,
        achievement,
        is_team,
        position,
        start_date,
        end_date,
        contribution,
        description,
        links,
        is_hidden: false,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("프로젝트 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/project`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({
      title,
      achievement,
      is_team,
      position,
      start_date,
      end_date,
      contribution,
      description,
      links,
    }: {
      title: string;
      achievement: string;
      is_team: boolean;
      position: string;
      start_date: string;
      end_date: string;
      contribution: string;
      description: string;
      links: {
        link: string;
        github: string;
      };
    }) => {
      setLoading(true);
      return await request.patch(`/api/user/portfolio/projects/${id}/`, {
        title,
        achievement,
        is_team,
        position,
        start_date,
        end_date,
        contribution,
        description,
        links,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("프로젝트 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/project`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const deleteProject = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await request.delete(`/api/user/portfolio/projects/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("프로젝트 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/project`);
    },
    onError: (error, variables, context) => {
      form.reset();
      setLoading(false);
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    const result = {
      title: data.title,
      achievement: data.achievement,
      is_team: check,
      position: data.position,
      start_date: formatDateYMD(`${data.start_year}.${data.start_month}.01`),
      end_date: formatDateYMD(`${data.end_year}.${data.end_month}.01`),
      contribution: data.contribution ?? "",
      description: data.description ?? "",
      links: { link: data.link ?? "", github: data.github ?? "" },
    };

    if (id) {
      updateProject.mutate(result);
    } else {
      createProject.mutate(result);
    }
  };

  useEffect(() => {
    if (project) {
      const startDate = project.start_date.split("-");
      const endDate = project.end_date.split("-");

      form.reset({
        ...project,
        start_year: startDate[0],
        start_month: startDate[1],
        end_year: endDate[0],
        end_month: endDate[1],
        link: project.links.link,
        github: project.links.github,
      });
      setCheck(project.is_team);
    }
  }, [form, project]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "프로젝트 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/project`}
            deleteClick={() => deleteProject.mutate()}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"프로젝트 명"}
                      require={true}
                      placeholder={"프로젝트 명을 입력해주세요."}
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
              name="achievement"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"어떤 성과를 얻었나요?"}
                      require={true}
                      placeholder={"프로젝트를 통해 달성한 성과를 입력해주세요"}
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
                <span className="text-sm font-semibold md:text-base">프로젝트 기간</span>
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
                        title={"팀구성"}
                        placeholder={"팀 구성을 입력해주세요.  예: FE2 BE1 Design 1"}
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
              name="contribution"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonTextarea
                      title={"프로젝트 설명"}
                      placeholder={
                        "담당한 업무, 프로젝트 및 활동을 입력해주세요. \n\n 예: \n\n - 쇼핑라이브 프론트 지면 개발 \n - 프론트 매시업 api 개발"
                      }
                      tip={"직무와 연관된 교육 내용  및 활동을 입력해주세요."}
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
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonTextarea
                      title={"어떤 기여를 했나요?"}
                      placeholder={
                        "담당한 업무, 프로젝트 및 활동을 입력해주세요. \n\n 예: \n\n - 쇼핑라이브 프론트 지면 개발 \n - 프론트 매시업 api 개발"
                      }
                      tip={"직무와 연관된 교육 내용  및 활동을 입력해주세요."}
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
              name="github"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"깃허브"}
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

export default UserProjectEdit;
