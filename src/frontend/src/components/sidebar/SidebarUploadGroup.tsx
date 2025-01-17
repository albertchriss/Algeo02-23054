"use client";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LuFiles } from "react-icons/lu";

import { usePathname } from "next/navigation";
const navLinks = [
  {
    name: "Upload",
    route: "/upload",
    icon: LuFiles,
  },
];
export const SidebarUploadGroup = () => {
  const pathname = usePathname();
  return (
    <SidebarGroup className="font-bold px-[10%] gap-2">
      <SidebarGroupLabel className="text-md">Upload data</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {navLinks.map((route, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                className={` active:bg-inherit ${
                  route.route === pathname
                    ? "text-cyan-tua drop-shadow-md hover:bg-inherit hover:text-cyan-tua active:text-cyan-tua"
                    : " hover:bg-inherit hover:text-cyan-tua/50 transition-all duration-300"
                }`}
              >
                <Link href={route.route} className="gap-8">
                  <route.icon className="scale-125" />
                  <span className="text-md">{route.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
