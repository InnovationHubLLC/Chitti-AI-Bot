"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard/calls", label: "Calls", icon: Phone },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/knowledge-base", label: "Knowledge Base", icon: BookOpen },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string): boolean => pathname.startsWith(href);

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-[#0a1525] border-r border-[#1a2e4a] text-white flex flex-col transition-all duration-200",
          collapsed ? "w-16" : "w-56",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:sticky"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#1a2e4a]">
          {!collapsed && (
            <Link href="/dashboard/calls" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center shadow-[0_0_12px_rgba(255,90,31,0.4)]">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Chitti</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center shadow-[0_0_12px_rgba(255,90,31,0.4)] mx-auto">
              <span className="text-sm font-bold text-white">C</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33] hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-1 px-2 flex flex-col">
          <div className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#1a2e4a] text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:rounded-r-full before:bg-accent-500"
                      : "text-[#6b8baf] hover:bg-[#111f33] hover:text-white"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-[#1a2e4a] pt-2 mt-2 space-y-1">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#1a2e4a] text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:rounded-r-full before:bg-accent-500"
                      : "text-[#6b8baf] hover:bg-[#111f33] hover:text-white"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-[#1a2e4a] bg-[#0a1525]">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="ml-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent-500 flex items-center justify-center shadow-[0_0_8px_rgba(255,90,31,0.3)]">
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <span className="font-bold text-white">Chitti</span>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
