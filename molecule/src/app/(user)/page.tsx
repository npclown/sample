"use client";

import BoardMainView from "@/components/board/main-view";
import Attendance from "@/components/index/attendance";
import Banner from "@/components/index/banner";
import { EmailConfirmAlertDialog } from "@/components/index/email-confirm-dialog";
import LiveIssue from "@/components/index/live-issue";
import MiniCalender from "@/components/index/mini-calender";
import QuestionCard from "@/components/index/question-card";
import { Board } from "@/lib/definitions";
import { useBoardList } from "@/store/queries/board/list";
import { useAuthUser } from "@/store/stores/use-auth-store";
import { useMediaQuery } from "react-responsive";

export default function Page() {
  const user = useAuthUser();
  const isLaptop = useMediaQuery({ minDeviceWidth: 768 });
  const { data: boards, isLoading, isError, isFetched } = useBoardList("main");

  return (
    <>
      <EmailConfirmAlertDialog />

      {isLaptop && <Banner />}
      <LiveIssue />

      <div className="mt-4 flex w-full flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="flex flex-col gap-4 md:grid md:flex-1 md:grid-cols-2">
            <BoardMainView boardName={"popular"} rank={true} title={"실시간 급상승 인기글"} />

            {isFetched &&
              boards?.map((board: Board, index) => (
                <BoardMainView key={index} boardName={board.name} rank={false} title={board.label + "게시판"} />
              ))}

            <QuestionCard className="col-span-2" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="top-4 space-y-4 xl:sticky">
              <MiniCalender />
              {user && <Attendance />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
