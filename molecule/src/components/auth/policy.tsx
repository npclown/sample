import Checkbox from "@/components/auth/checkbox";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface PolicyType {
  private: boolean;
  use: boolean;
}

export default function Policy({ onSuccess }: { onSuccess: Function }) {
  const [checkList, setCheckList] = useState<PolicyType>({
    private: false,
    use: false,
  });

  const vaildatePolicy = () => {
    if (!(checkList.private && checkList.use)) {
      toast.warn("모든 약관에 동의해주세요.");
      return false;
    }

    return true;
  };

  const next = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vaildatePolicy()) return;

    onSuccess();
  };

  const onChangeCheckList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.name;
    const checked = e.target.checked;

    if (type === "all_agree") {
      setCheckList({
        private: checked,
        use: checked,
      });
    } else if (type !== "all_agree") {
      setCheckList({ ...checkList, [type]: checked });
    }
  };

  return (
    <form
      className="mx-auto flex max-w-[400px] flex-col gap-4 md:max-w-none md:px-8"
      autoComplete="off"
      onSubmit={next}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            onChange={onChangeCheckList}
            checked={checkList.private && checkList.use}
            name="all_agree"
            label="개인정보 수집 및 이용, 이용약관에 모두 동의합니다"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              onChange={onChangeCheckList}
              checked={checkList.private}
              name="private"
              label="[필수] 개인정보 수집 및 이용에 동의합니다"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              onChange={onChangeCheckList}
              checked={checkList.use}
              name="use"
              label="[필수] 이용약관에 모두 동의합니다"
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button className="w-full" type="submit">
          다음
        </Button>
      </div>
    </form>
  );
}
