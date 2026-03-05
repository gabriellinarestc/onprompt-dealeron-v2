"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquareText,
  AlertCircle,
  Building2,
  Bug,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: MessageSquareText, label: "Prompts", href: "/prompts" },
  { icon: AlertCircle, label: "Content Gaps", href: "/content-gaps" },
  { icon: Building2, label: "Brands", href: "/brands" },
  { icon: Bug, label: "Crawler Logs", href: "/crawler-logs" },
  { icon: Users, label: "Visitor Analytics", href: "/visitor-analytics" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Floating toggle button on sidebar edge */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[18px] z-50 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
      >
        <ChevronLeft
          className={cn(
            "size-3.5 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </button>

      <div className={cn("flex h-14 items-center border-b border-sidebar-border", collapsed ? "justify-center px-0" : "gap-2 px-4")}>
        {!collapsed ? (
          <span className="select-none text-lg tracking-tight">
            <span className="font-light text-foreground">On</span>
            <span className="font-extrabold text-primary">Prompt</span>
          </span>
        ) : (
          <span className="flex size-8 shrink-0 select-none items-center justify-center text-base font-extrabold tracking-tighter text-primary">
            Op
          </span>
        )}
      </div>

      <nav className="flex-1 p-2">
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
                  collapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive
                    ? "bg-sidebar-accent text-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <Link
          href="/settings"
          className={cn(
            "flex w-full items-center rounded-md py-2 text-sm transition-colors",
            collapsed ? "justify-center px-0" : "gap-3 px-3",
            pathname === "/settings"
              ? "bg-sidebar-accent text-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="size-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          className={cn(
            "flex w-full items-center rounded-md py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "justify-center px-0" : "gap-3 px-3"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  )
}
