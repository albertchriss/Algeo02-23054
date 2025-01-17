import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader className="bg-white text-secondary">
      <SidebarMenu>
        <SidebarMenuItem className="py-16 flex justify-center items-center">
          <h1 className="w-full text-center text-black text-2xl font-bold">
            Micin Kriuk
          </h1>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
