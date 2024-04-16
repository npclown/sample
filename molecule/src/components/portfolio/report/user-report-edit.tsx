"use client";

import request from "@/lib/api/request";
import { formatDateYMD } from "@/lib/utils";
import { useReport } from "@/store/queries/portfolio/portfolio";
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

const reportFormSchema = z.object({
  agency: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(16, { message: "16자를 넘어갈 수 없습니다." }),
  vendor: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(16, { message: "16자를 넘어갈 수 없습니다." }),
  issue_id: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(16, { message: "16자를 넘어갈 수 없습니다." }),
  score: z
    .string()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(16, { message: "40자를 넘어갈 수 없습니다." }),
  year: z.string(),
  month: z.string(),
  day: z.string(),
  short_description: z.string().trim().max(255, { message: "255자를 넘어갈 수 없습니다." }).optional(),
  description: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(1000, { message: "1000자를 넘어갈 수 없습니다." })
    .optional(),
  link: z.string().trim().optional(),
  vendor_link: z.string().trim().optional(),
  cve: z.string().trim().optional(),
});

type reportFormValues = z.infer<typeof reportFormSchema>;

const defaultValues: Partial<reportFormValues> = {
  agency: "",
  vendor: "",
  issue_id: "",
  score: "",
  short_description: "",
  description: "",
  link: "",
  vendor_link: "",
  cve: "",
};

const UserReportEdit = ({ portfolioId, id }: { portfolioId: string; id?: string }) => {
  const router = useRouter();
  const { data: report, refetch } = useReport(portfolioId, id ?? "", {
    enabled: id !== null,
  });

  const form = useForm<reportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createReport = useMutation({
    mutationFn: async ({
      agency,
      vendor,
      issue_id,
      score,
      date,
      short_description,
      description,
      links,
    }: {
      agency: string;
      vendor: string;
      issue_id: string;
      score: string;
      date: string;
      is_hidden: boolean;
      short_description?: string;
      description?: string;
      links?: {
        cve: string;
        vendor_link: string;
        link: string;
      };
    }) => {
      return await request.post("/api/user/portfolio/bounties/", {
        agency,
        vendor,
        issue_id,
        score,
        date,
        short_description,
        description,
        links,
        is_hidden: false,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("취약점 제보 등록에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/report`);
    },
    onError: (error, variables, context) => {
      form.reset();
    },
  });

  const updateReport = useMutation({
    mutationFn: async ({
      agency,
      vendor,
      issue_id,
      score,
      date,
      short_description,
      description,
      links,
    }: {
      agency: string;
      vendor: string;
      issue_id: string;
      score: string;
      date: string;
      is_hidden: boolean;
      short_description?: string;
      description?: string;
      links?: {
        cve: string;
        vendor_link: string;
        link: string;
      };
    }) => {
      return await request.patch(`/api/user/portfolio/bounties/${id}/`, {
        agency,
        vendor,
        issue_id,
        score,
        date,
        short_description,
        description,
        links,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("취약점 제보 수정에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/report`);
    },
    onError: (error, variables, context) => {
      form.reset();
    },
  });

  const deleteReport = useMutation({
    mutationFn: async () => {
      return await request.delete(`/api/user/portfolio/bounties/${id}/`);
    },
    onSuccess: (data, variables, context) => {
      toast.success("취약점 제보 삭제에 성공했습니다.");
      router.push(`/portfolio/${portfolioId}/report`);
    },
    onError: (error, variables, context) => {
      form.reset();
    },
  });

  const onSubmit = (data: reportFormValues) => {
    const result = {
      agency: data.agency,
      vendor: data.vendor,
      issue_id: data.issue_id,
      score: data.score,
      date: formatDateYMD(`${data.year}.${data.month}.${data.day}`),
      links: { link: data.link ?? "", cve: data.cve ?? "", vendor_link: data.vendor_link ?? "" },
      description: data.description ?? "",
      short_description: data.short_description ?? "",
    };

    if (id) {
      // @ts-ignore
      updateReport.mutate(result);
    } else {
      // @ts-ignore
      createReport.mutate(result);
    }
  };

  useEffect(() => {
    if (report) {
      const date = report.date.split("-");

      form.reset({
        ...report,
        year: date[0],
        month: date[1],
        day: date[2],
        link: report.links.link,
        cve: report.links.cve,
        vendor_link: report.links.vendor_link,
      });
    }
  }, [form, report]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
          <CommonEdit
            deleteText={id ? "발표 삭제" : ""}
            cancelLink={`/portfolio/${portfolioId}/report`}
            deleteClick={() => deleteReport.mutate()}
          >
            <FormField
              control={form.control}
              name="agency"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"인증 기관"}
                      require={true}
                      placeholder={"발급 기관을 입력해주세요. (예 : PatchDay, ZDI, 등)"}
                      field={field}
                      max={16}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"Vendor"}
                      placeholder={"Vendor ID를 입력해주세요. (예: SVE-1234-12345)"}
                      field={field}
                      max={16}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issue_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"취약점 ID"}
                      placeholder={"발급된 CVE/KVE 등의 ID를 입력해주세요. (예: CVE-1234-12345)"}
                      field={field}
                      max={16}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"취약점 등급"}
                      placeholder={"취약점 등급을 입력해주세요. (예: score 7.8 HIGH)"}
                      field={field}
                      max={16}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"설명"}
                      placeholder={"취약점에 대한 간단한 설명을 입력해주세요."}
                      field={field}
                      max={255}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-semibold md:text-base">발급 일자</span>
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
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                            return (
                              <SelectItem key={day} value={day.toString().padStart(2, "0")}>
                                {day}일
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
                      title={"취약점에 대한 상세 설명을 입력해주세요."}
                      placeholder={
                        "취약점에 대한 상세 설명을 입력해주세요.\n\n\
                        예:\n\
                        발생 원리, 발생 위치, PoC 등\n\
                        "
                      }
                      tip={"상세 내용을 추가하면 제안 확률이 10배 높아져요!"}
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
              name="cve"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"취약점 링크"}
                      placeholder={"등록된 취약점과 관련된 링크를 URL을 추가해주세요."}
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
              name="vendor_link"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CommonInput
                      title={"Vendor 링크"}
                      placeholder={"Vendor와 관련된 링크가 있다면 URL을 추가해주세요."}
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
                      title={"기타 링크 연결"}
                      placeholder={"다른 기타 링크가 있다면 URL을 추가해주세요."}
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

export default UserReportEdit;
