import React from "react";
import {
  HomeOutlined,
  ScissorOutlined,
  ShoppingOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { AdminTabEnum } from "@/enum/AppEnum";

export interface AdminNavItem {
  key: AdminTabEnum;
  /** Route this section lives at. Doubles as the antd Menu key. */
  path: string;
  label: string;
  /** Shown under the page title in the content area. */
  description: string;
  icon: React.ReactNode;
}

/**
 * Single source of truth for the admin sections: the sidebar renders the menu
 * from it, each route's page reads its title/description from it, so the two
 * can't drift apart.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  {
    key: AdminTabEnum.HOME,
    path: "/",
    label: "Trang chủ",
    description:
      "Nội dung hiển thị trên trang chủ: banner, thông tin liên hệ, mẫu tóc và chi nhánh.",
    icon: <HomeOutlined />,
  },
  {
    key: AdminTabEnum.SERVICES,
    path: "/services",
    label: "Dịch vụ",
    description: "Danh sách gói dịch vụ hiển thị trên trang Dịch vụ.",
    icon: <ScissorOutlined />,
  },
  {
    key: AdminTabEnum.PRODUCTS,
    path: "/products",
    label: "Sản phẩm",
    description: "Danh sách sản phẩm chăm sóc tóc & râu hiển thị trên trang Sản phẩm.",
    icon: <ShoppingOutlined />,
  },
  {
    key: AdminTabEnum.ABOUT,
    path: "/about",
    label: "Giới thiệu",
    description:
      "Nội dung trang Giới thiệu: câu chuyện thương hiệu, cột mốc lịch sử và đội ngũ thợ.",
    icon: <ProfileOutlined />,
  },
];

/** Resolves the nav item for a given pathname, falling back to Home. */
export const getNavItemByPath = (pathname: string): AdminNavItem => {
  const exact = ADMIN_NAV.find((item) => item.path === pathname);
  if (exact) return exact;

  const nested = ADMIN_NAV.find(
    (item) => item.path !== "/" && pathname.startsWith(`${item.path}/`)
  );
  return nested ?? ADMIN_NAV[0];
};
