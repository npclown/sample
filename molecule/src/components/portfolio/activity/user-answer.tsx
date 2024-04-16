"use client";

import { useAnswers } from "@/store/queries/portfolio/portfolio";
import { useEffect } from "react";

import AnswerSkeleton from "./answer-skeleton";
import AnswerView from "./answer-view";

const UserAnswer = ({ portfolioId }: { portfolioId: string }) => {
  const { data: answer, isLoading, refetch } = useAnswers(portfolioId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <AnswerSkeleton />;
  }

  return (
    answer && (
      <div className="space-y-2">
        <div>답변 {answer.length}개</div>
        <div className="space-y-4">
          {answer.map((answerInfo: any) => {
            return <AnswerView key={answerInfo.id} answerInfo={answerInfo} refetch={refetch} />;
          })}
        </div>
      </div>
    )
  );
};

export default UserAnswer;
