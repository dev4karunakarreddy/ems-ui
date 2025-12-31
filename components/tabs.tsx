import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import path from "path";

export type Role = "admin" | "manager" | "user";

export type DashboardTab = {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
};

export const dashboardTabs: DashboardTab[] = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: <DashboardIcon />,
    roles: ["admin", "manager", "user"],
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: <PeopleIcon />,
    roles: ["admin"],
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: <SettingsIcon />,
    roles: ["admin", "manager"],
  },
];

export const profileTabs = [
  {
  label: "Profile",
  path: "/dashboard/profile"
  },
  {
  label: "Account",
  path: "/dashboard/account"
  },
  {
  label: "logout",
  path: "/logout"
  }
]