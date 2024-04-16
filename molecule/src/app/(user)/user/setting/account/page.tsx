import { Separator } from "@/components/ui/separator";
import PasswordForm from "@/components/user/setting/account/password-form";
import ResignForm from "@/components/user/setting/account/resign-form";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium md:text-lg">계정 설정</h3>
        <p className="text-xs text-muted-foreground md:text-sm">
          계정 설정을 통해 비밀번호 변경 및 회원 탈퇴를 할 수 있습니다.
        </p>
      </div>
      <Separator />

      <div className="flex flex-col gap-8">
        <PasswordForm />

        <Separator />

        <ResignForm />
      </div>
    </div>
  );
}
