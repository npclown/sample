import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { useAuthUser } from "@/store/stores/use-auth-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function EmailConfirmAlertDialog() {
  const user = useAuthUser();

  const mutation = useMutation({
    mutationFn: async () => {
      return await request.get("/api/auth/send-verification/");
    },
    onSuccess: (data, variables, context) => {
      toast.success("이메일이 재전송되었습니다, 메일함을 확인해주세요");
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.message);
    },
  });

  const handleSendVerification = () => mutation.mutate();

  return (
    <>
      {user?.is_email_verified === false && (
        <AlertDialog defaultOpen>
          <AlertDialogTrigger></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>이메일 인증을 먼저 완료해주세요!</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>이메일 인증을 완료해야 ION 커뮤니티를 이용할 수 있습니다.</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleSendVerification}>이메일 재전송</AlertDialogAction>
              <AlertDialogCancel>닫기</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
