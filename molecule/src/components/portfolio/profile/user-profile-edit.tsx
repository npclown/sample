"use client";

import request from "@/lib/api/request";
import { useProfile } from "@/store/queries/portfolio/portfolio";
import { useAuthStore } from "@/store/stores/use-auth-store";
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
import CommonTextarea from "../common-textarea";
import UploadProfileImage from "./upload-profile-image";

const profileFormSchema = z.object({
  // 이름
  name: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(40, { message: "40자를 넘어갈 수 없습니다." }),
  // 소속
  affiliation: z
    .string()
    .trim()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(40, { message: "40자를 넘어갈 수 없습니다." }),
  // 프로필 주소
  profile_url: z
    .string()
    .min(1, {
      message: "공백은 허용하지 않습니다.",
    })
    .max(40, { message: "40자를 넘어갈 수 없습니다." }),
  // 자기소개
  bio: z.string().trim().max(1000, { message: "1000자를 넘어갈 수 없습니다." }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  name: "",
  affiliation: "",
  profile_url: "",
  bio: "",
};

const UserProfileEdit = ({ portfolioId }: { portfolioId: string }) => {
  const router = useRouter();
  const { data: profile, refetch } = useProfile(portfolioId);
  const toggleReload = useAuthStore((state) => state.toggleReload);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const updateProfile = useMutation({
    mutationFn: async ({
      name,
      affiliation,
      profile_url,
      bio,
    }: {
      name: string;
      affiliation: string;
      profile_url: string;
      bio?: string;
    }) => {
      return await request.patch("/api/user/profile/", { name, affiliation, profile_url, bio });
    },
    onSuccess: (data, variables, context) => {
      if (data.data.status === "success") {
        toast.success("계정 정보 변경에 성공했습니다.");
        toggleReload();
        router.push(`/portfolio/${variables.profile_url}/profile`);
      } else {
        toast.error("계정 정보를 변경하는 중 오류가 발생했습니다");
      }
    },
    onError: (error, variables, context) => {
      toast.error("계정 정보를 변경하는 중 오류가 발생했습니다");
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data);
  };

  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  return (
    profile && (
      <div className="-m-2 flex flex-col items-center justify-center gap-8 px-0 py-8 md:m-auto md:px-2">
        <UploadProfileImage image_url={profile.image_url} profileRefetch={refetch} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[600px] space-y-8">
            <CommonEdit deleteText="" cancelLink={`/portfolio/${portfolioId}/profile`}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CommonInput title={"이름"} require={true} placeholder={"이름을 입력해주세요."} field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CommonInput title={"소속"} require={true} placeholder={"소속을 입력해주세요."} field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CommonInput
                        title={"포트폴리오 핸들"}
                        require={true}
                        placeholder={"주소로 사용할 핸들을 입력해주세요. 예:ion"}
                        field={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CommonTextarea title={"자기소개"} placeholder={"나를 소개 해주세요."} max={1000} field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CommonEdit>
          </form>
        </Form>
      </div>
    )
  );
};

export default UserProfileEdit;
