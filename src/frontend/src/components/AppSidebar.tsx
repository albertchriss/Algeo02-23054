"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./AppSidebarHeader";
import { SidebarUploadGroup } from "./SidebarUploadGroup";

export const AppSidebar = () => {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent className="bg-hitam/95 text-secondary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-secondary">
            Query
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="px-2">
                <div className="border-gray-500 border-dashed border-[2px] bg-gray-800 w-full h-[125px] rounded-lg flex justify-center items-center">
                  <p className="text-slate-500 italic">Upload file</p>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarUploadGroup />
    </Sidebar>
  );
};
