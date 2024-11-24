import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader className="bg-hitam/95 text-secondary">
      <SidebarMenu>
        <SidebarMenuItem className="py-1 flex justify-center items-center">
          <h1 className="w-full text-center text-2xl font-bold">Micin Kriuk</h1>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
