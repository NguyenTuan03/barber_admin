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
  label: string;
  /** Shown under the page title in the content area. */
  description: string;
  icon: React.ReactNode;
}

/**
 * Single source of truth for the admin sections: the sidebar renders the menu
 * from it and the content area reads the title/description from it, so the two
 * can't drift apart.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  {
    key: AdminTabEnum.HOME,
    label: "Trang chủ",
    description:
      "Nội dung hiển thị trên trang chủ: banner, thông tin liên hệ, mẫu tóc và chi nhánh.",
    icon: <HomeOutlined />,
  },
  {
    key: AdminTabEnum.SERVICES,
    label: "Dịch vụ",
    description: "Danh sách gói dịch vụ hiển thị trên trang Dịch vụ.",
    icon: <ScissorOutlined />,
  },
  {
    key: AdminTabEnum.PRODUCTS,
    label: "Sản phẩm",
    description: "Danh sách sản phẩm chăm sóc tóc & râu hiển thị trên trang Sản phẩm.",
    icon: <ShoppingOutlined />,
  },
  {
    key: AdminTabEnum.ABOUT,
    label: "Giới thiệu",
    description:
      "Nội dung trang Giới thiệu: câu chuyện thương hiệu, cột mốc lịch sử và đội ngũ thợ.",
    icon: <ProfileOutlined />,
  },
];

export const getNavItem = (key: AdminTabEnum): AdminNavItem =>
  ADMIN_NAV.find((item) => item.key === key) ?? ADMIN_NAV[0];
