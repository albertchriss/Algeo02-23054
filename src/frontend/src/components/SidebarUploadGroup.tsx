import { Button } from "./ui/button";
import {
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export const SidebarUploadGroup = () => {
  return (
    <SidebarFooter className="bg-hitam/95 text-secondary">
      <SidebarGroup>
        <SidebarGroupLabel className="text-secondary">Upload Database</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2 pb-6">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button className="bg-cyan-tua/70 hover:bg-cyan-tua active:bg-cyan-tua active:text-white active:scale-90 py-5 hover:text-white text-lg transition-all duration-200 w-[80%] place-self-center">
                  uplod gambar
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button className="bg-cyan-muda/90 hover:bg-cyan-muda active:bg-cyan-muda text-black active:text-black active:scale-90 py-5 hover:text-black text-lg transition-all duration-200 w-[80%] place-self-center">
                  uplod suara
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button className="bg-cyan-tua/70 hover:bg-cyan-tua active:bg-cyan-tua active:text-white active:scale-90 py-5 hover:text-white text-lg transition-all duration-200 w-[80%] place-self-center">
                  uplod meper
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarFooter>
  );
};
