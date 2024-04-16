import { usePortfolioStore } from "@/store/stores/use-portfolio-store";
import Link from "next/link";
import { useEffect } from "react";

import Loading from "../common/loading";
import CommonButton from "./common-button";

const CommonEdit = ({
  deleteText = "삭제",
  cancelLink,
  deleteClick,
  children,
}: {
  deleteText?: string;
  deleteClick?: Function | undefined;
  cancelLink: string;
  children: React.ReactNode;
}) => {
  const { loading, setLoading } = usePortfolioStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center gap-6">
      {children}
      <div className="flex flex-col items-center justify-center">
        {deleteText && (
          <CommonButton
            variant="link"
            className="mb-10 text-sm font-medium text-[#101729] underline md:text-base"
            type="button"
            onClick={(e: any) => deleteClick && deleteClick(e)}
          >
            {deleteText}
          </CommonButton>
        )}
        <div className="mt-5 flex gap-8">
          <CommonButton variant="outline" type="reset" className="px-8" asChild>
            <Link href={cancelLink}>취소</Link>
          </CommonButton>
          <CommonButton type="submit" className="px-8">
            완료
          </CommonButton>
        </div>
      </div>
      {loading && (
        <div className="absolute left-0 top-0 inline-flex size-full items-center justify-center bg-none">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CommonEdit;
