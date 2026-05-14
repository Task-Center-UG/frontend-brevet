import { LucideIcon } from "lucide-react";
import { routePermissions } from "@/middleware";
import { useDecodedToken } from "./use-decoded-token";

export type ProjectItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export const useFilteredManagement = (projects: ProjectItem[]) => {
  const decodedToken = useDecodedToken();
  if (!decodedToken) return [];

  const role = decodedToken.role?.toLowerCase();
  let allowedRoutes: string[] = [];

  switch (role) {
    case "admin":
      allowedRoutes = [
        ...routePermissions.baseRoutes,
        ...routePermissions.adminRoutes,
        ...routePermissions.commonAdminAndTeacherRoutes,
      ];
      break;
    case "guru":
      allowedRoutes = [
        ...routePermissions.baseRoutes,
        ...routePermissions.teacherRoutes,
        ...routePermissions.commonAdminAndTeacherRoutes,
      ];
      break;
    case "siswa":
      allowedRoutes = [
        ...routePermissions.baseRoutes,
        ...routePermissions.studentRoutes,
      ];
      break;
  }

  return projects.filter((project) => allowedRoutes.includes(project.url));
};
