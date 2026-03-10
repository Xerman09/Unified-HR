export type AppLink = {
  id: string;
  label: string;
  url: string;
};

export type AppGroup = {
  group: string;
  items: AppLink[];
};

export const APP_GROUPS: AppGroup[] = [
  {
    group: "Men2 HR System",
    items: [
      { id: "men2-attendance", label: "Attendance Report", url: "http://192.168.0.143:7777" },
      { id: "men2-users", label: "User Management", url: "http://192.168.0.143:3002/userlist.html" },
      { id: "men2-payroll", label: "Payroll System", url: "http://192.168.0.143:9001" },
    ],
  },
  {
    group: "Vertex HR System",
    items: [
      { id: "vertex-attendance", label: "Attendance Report", url: "http://192.168.0.143:9874" },
      { id: "vertex-users", label: "User Management", url: "http://192.168.0.143:6001/userlist.html" },
      { id: "vertex-payroll", label: "Payroll System", url: "http://192.168.0.143:9002" },
    ],
  },
  {
    group: "HANVIN HR SYSTEM",
    items: [
      { id: "hanvin-attendance", label: "Attendance Report", url: "http://192.168.0.143:8888" },
      { id: "hanvin-users", label: "User Management", url: "http://192.168.0.143:3003/userlist.html" },
      { id: "hanvin-payroll", label: "Payroll System", url: "http://192.168.0.143:9003" },
    ],
  },
    {
    group: "MEN2 MANILA",
    items: [
      { id: "men2-manila-attendance", label: "Attendance Report", url: "http://100.103.111.11:10002" },
      { id: "men2-manila-users", label: "User Management", url: "http://100.103.111.11:10001/userlist.html" },
      { id: "men2-manila-payroll", label: "Payroll System", url: "http://192.168.0.143:9003" },
    ],
  },
];

export type AppMeta = AppLink & { group: string };

export const APP_INDEX: Record<string, AppMeta> = Object.fromEntries(
  APP_GROUPS.flatMap((g) => g.items.map((i) => [i.url, { ...i, group: g.group }]))
);

export const ALLOWED_URLS = new Set(Object.keys(APP_INDEX));
export const DEFAULT_URL = APP_GROUPS[0]?.items[0]?.url ?? "about:blank";

export function getAppMetaByUrl(url: string | null | undefined): AppMeta | null {
  if (!url) return null;
  return APP_INDEX[url] ?? null;
}
