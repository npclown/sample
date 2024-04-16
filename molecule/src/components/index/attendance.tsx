"use client";

import request from "@/lib/api/request";
import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Attendance() {
  const [isAttended, setIsAttended] = useState<boolean>(false);

  const handleAttendance = () => {
    request
      .post("/api/attendances/")
      .then((response) => {
        if (response.status === 201) {
          toast.success("출석체크를 완료했습니다");
          setIsAttended(true);
        } else {
          toast.warn("출석체크를 이미 완료했습니다");
        }
      })
      .catch((err) => {
        toast.error("출석체크에 실패했습니다");
      });
  };

  useEffect(() => {
    request.get("/api/attendances/check/").then((response) => {
      if (response.data.data?.attended) setIsAttended(true);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <h1 className="text-base font-bold text-gray-500 dark:text-gray-300 md:text-lg">출석체크</h1>

      <button
        onClick={handleAttendance}
        className="flex w-full items-center justify-center gap-1 rounded-lg bg-ionblue-200 py-3 font-sans text-sm font-bold transition hover:bg-ionblue-300 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-ionblue-600 dark:disabled:bg-gray-600"
        disabled={isAttended}
      >
        <CheckCircleIcon className="h-5 w-5" />

        <span>출석체크 {isAttended && "완료"}</span>
      </button>

      <span className="text-xs text-gray-600 dark:text-gray-300">
        <InformationCircleIcon className="mr-1 inline-block h-4 w-4" />
        출석체크는 하루에 한 번만 할 수 있습니다.
      </span>

      <Link
        href="/ranking/attendances"
        className="w-full rounded-lg border border-gray-200 py-1 text-center text-xs transition hover:bg-gray-200 dark:hover:bg-gray-600 md:text-sm"
      >
        출석체크 랭킹 확인하기
      </Link>
    </div>
  );
}
