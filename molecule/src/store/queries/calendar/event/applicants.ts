import request from "@/lib/api/request";
import { Applicant } from "@/lib/definitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

const applicantListQueryKey = createQueryKeys("applicants", {
  applicants: (calendar_name, event_pk) => ["applicants", calendar_name, event_pk],
});

const getApplicantList = async (calendar_name: string, event_pk: string) => {
  try {
    const { data } = await request.get<{ data: Applicant[] }>(
      `/api/calendars/${calendar_name}/events/${event_pk}/applicants/`,
    );

    return data.data;
  } catch (err) {
    throw err;
  }
};

export const useApplicantList = (calendar_name: string, event_pk: string) =>
  useQuery({
    queryKey: applicantListQueryKey.applicants(calendar_name, event_pk).queryKey,
    queryFn: () => getApplicantList(calendar_name, event_pk),
  });
