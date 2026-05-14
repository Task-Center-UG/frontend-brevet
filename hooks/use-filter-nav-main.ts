import { LucideIcon } from "lucide-react";
import { rolePermissions } from "@/middleware";
import { useDecodedToken } from "./use-decoded-token";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export const useFilteredNavMain = (menu: NavItem[]) => {
  const decodedToken = useDecodedToken();
  if (!decodedToken) return [];

  const role = decodedToken.role?.toLowerCase() as keyof typeof rolePermissions;
  const denyRoutes = rolePermissions[role]
    .filter((perm) => perm.deny)
    .flatMap((perm) => perm.routes);

  return menu
    .map((nav) => {
      const isDenied = denyRoutes.some((route) => nav.url.startsWith(route));
      const filteredItems = nav.items?.filter(
        (item) => !denyRoutes.some((route) => item.url.startsWith(route))
      );

      if (!isDenied || (filteredItems && filteredItems.length > 0)) {
        return {
          ...nav,
          url: isDenied ? "" : nav.url,
          items: filteredItems ?? [],
        };
      }

      return null;
    })
    .filter(Boolean) as NavItem[];
};
