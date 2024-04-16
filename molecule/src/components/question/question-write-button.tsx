"use client";

import { useAuthStore } from "@/store/stores/use-auth-store";
import { PencilIcon } from "@heroicons/react/24/solid";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const QuestionWriteButton = ({
  acceptPoint,
  setAcceptPoint,
  handleSubmit,
}: {
  acceptPoint: number;
  setAcceptPoint: Function;
  handleSubmit: Function;
}) => {
  const user = useAuthStore((state) => state.user);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-gray-900 text-white dark:bg-gray-500 dark:text-white">
          <PencilIcon className="h-4 w-4" />
          <span>설정 후 등록</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>질문 설정</DialogTitle>
          <DialogDescription>질문을 등록하기 전에 기본 설정을 완료해주세요.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="accepting_points">채택시 지급할 eV</Label>
          <Input
            id="accepting_points"
            value={acceptPoint}
            onChange={(e) => setAcceptPoint(e.target.value)}
            type="number"
            placeholder="최대 256ev까지 설정할 수 있습니다."
          />
          <span className="text-xs">보유: {user?.points.point.toLocaleString() ?? 0} eV</span>
        </div>

        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-md dark:bg-gray-500"
          onClick={() => handleSubmit()}
        >
          <PencilIcon className="h-4 w-4" />
          <span>작성</span>
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionWriteButton;
