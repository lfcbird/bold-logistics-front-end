import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Send,
  IdCard,
  Truck,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { api, auth } from "@/lib/api";
import { toast } from "sonner";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, group: "Overview" },
  { title: "Customers", url: "/customers", icon: Users, group: "Operations" },
  { title: "Orders", url: "/orders", icon: Package, group: "Operations" },
  { title: "Dispatches", url: "/dispatches", icon: Send, group: "Operations" },
  { title: "Drivers", url: "/drivers", icon: IdCard, group: "Fleet" },
  { title: "Vehicles", url: "/vehicles", icon: Truck, group: "Fleet" },
  { title: "Documents", url: "/documents", icon: FileText, group: "Records" },
  { title: "Reports", url: "/reports", icon: BarChart3, group: "Records" },
];

const groups = ["Overview", "Operations", "Fleet", "Records"] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const user = auth.getUser();

  const handleLogout = () => {
    api.logout();
    toast.success("Signed out");
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-4">
        <Logo collapsed={collapsed} variant="light" />
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group);
          return (
            <SidebarGroup key={group}>
              {!collapsed && (
                <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/50">
                  {group}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const active = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-semibold data-[active=true]:shadow-glow text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <NavLink to={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-3">
        {!collapsed && user && (
          <div className="mb-2 rounded-lg bg-sidebar-accent/60 p-2.5">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/60 truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
