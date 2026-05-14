import { useGetData } from "@/hooks/use-get-data";
import { TGuru } from "@/components/(dashboard)/guru/_types/guru-type";

export function useGetAssignedTeachers(meetingId: string) {
  const { data, isLoading, isError } = useGetData({
    queryKey: ["assigned-teachers", meetingId],
    dataProtected: `meetings/${meetingId}/teachers`,
  });

  const teachers: TGuru[] = data?.data?.data ?? [];

  return {
    teachers,
    isLoading,
    isError,
  };
}
