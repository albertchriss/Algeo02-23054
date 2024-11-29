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

import { HiOutlineHome } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { IoMdMusicalNotes } from "react-icons/io";

import { FiGrid } from "react-icons/fi";

import { usePathname } from "next/navigation";
const navLinks = [
  {
    name: "Home",
    route: "/",
    icon: HiOutlineHome,
  },
  {
    name: "Search",
    route: "/search",
    icon: IoSearch,
  },
  {
    name: "Album",
    route: "/album",
    icon: FiGrid,
  },
  {
    name: "Song",
    route: "/song",
    icon: IoMdMusicalNotes,
  },
];
export const SidebarMenuGroup = () => {
  const pathname = usePathname();
  return (
    <SidebarGroup className="font-bold px-[10%] gap-2">
      <SidebarGroupLabel className="text-md">
        Menu
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {navLinks.map((route, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                className={` active:bg-inherit ${
                  route.route === pathname
                    ? "text-cyan-tua drop-shadow-md hover:bg-inherit hover:text-cyan-tua active:text-cyan-tua"
                    : " hover:bg-inherit hover:text-cyan-tua/50 transition-all duration-200"
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
