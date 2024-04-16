import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/user/setting/profile-form";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium md:text-lg">프로필 설정</h3>
        <p className="text-xs text-muted-foreground md:text-sm">사이트에서 다른 사람에게 공개되는 정보를 설정합니다.</p>
      </div>

      <Separator />

      <ProfileForm />
    </div>
  );
}
