"use client";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./AppSidebarHeader";
import { SidebarMenuGroup } from "./SidebarMenuGroup";
import { SidebarUploadGroup } from "./SidebarUploadGroup";

export const AppSidebar = () => {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent className="bg-white">
        <SidebarMenuGroup />
        <SidebarUploadGroup />
      </SidebarContent>
    </Sidebar>
  );
};
