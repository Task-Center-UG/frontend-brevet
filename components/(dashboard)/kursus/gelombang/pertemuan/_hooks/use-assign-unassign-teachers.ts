import axiosInstance from "@/helpers/axios-instance";
import { toast } from "sonner";

type Params = {
  meetingId: string;
  oldTeacherIds: string[];
  newTeacherIds: string[];
};

export const useAssignUnassignTeachersToMeeting = () => {
  const assign = async (meetingId: string, teacherIds: string[]) => {
    try {
      await axiosInstance.post(`/meetings/${meetingId}/teachers`, {
        teacher_ids: teacherIds,
      });
    } catch (error) {
      console.error("❌ Gagal assign pengajar:", error);
      toast.error("Gagal assign pengajar.");
    }
  };

  const unassign = async (meetingId: string, userId: string) => {
    try {
      await axiosInstance.delete(`/meetings/${meetingId}/teachers/${userId}`);
    } catch (error) {
      console.error("❌ Gagal unassign pengajar:", error);
      toast.error("Gagal unassign pengajar.");
    }
  };

  const sync = async ({ meetingId, oldTeacherIds, newTeacherIds }: Params) => {
    const toAdd = newTeacherIds.filter((id) => !oldTeacherIds.includes(id));
    const toRemove = oldTeacherIds.filter((id) => !newTeacherIds.includes(id));

    if (toAdd.length) {
      await assign(meetingId, toAdd);
    }

    await Promise.all(toRemove.map((id) => unassign(meetingId, id)));

    if (toAdd.length || toRemove.length) {
      toast.success("Pengajar berhasil diperbarui.");
    }
  };

  return { assign, unassign, sync };
};
