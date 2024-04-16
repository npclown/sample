import request from "@/lib/api/request";
import { Attendance } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const attendanceRankQueryKey = createQueryKeys("attendances", {
  attendances: (date) => ["attendances", date],
});

const getAttendanceRank = async (date: string) => {
  try {
    const { data } = await request.get<{
      data: {
        date: string;
        results: Attendance[];
      };
    }>("/api/attendances/", {
      params: { date },
    });

    return data.data.results;
  } catch (err) {
    throw err;
  }
};

export const useAttendanceRank = (date: string) =>
  useQuery({
    queryKey: attendanceRankQueryKey.attendances(date).queryKey,
    queryFn: () => getAttendanceRank(date),
  });
