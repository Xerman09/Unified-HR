export type AppLink = {
  id: string;
  label: string;
  url: string;
  fallbackUrl?: string;
  isPayroll?: boolean;
};

export type AppGroup = {
  group: string;
  items: AppLink[];
};

export const APP_GROUPS: AppGroup[] = [
  {
    group: "UNIFIED PAYROLL",
    items: [
      { id: "unified-payroll", label: "Payroll System", url: "http://192.168.0.253:10002/portal", fallbackUrl: "http://vtc:10002/portal", isPayroll: true },
    ],
  },
  {
    group: "Men2 Dagupan",
    items: [
      { id: "men2-attendance", label: "Attendance Report", url: "http://192.168.0.253:11003", fallbackUrl: "http://vtc:11003" },
      { id: "men2-users", label: "User Management", url: "http://192.168.0.253:11001/userlist.html", fallbackUrl: "http://vtc:11001/userlist.html" },
    ],
  },
  {
    group: "Vertex",
    items: [
      { id: "vertex-attendance", label: "Attendance Report", url: "http://192.168.0.253:12003", fallbackUrl: "http://vtc:12003" },
      { id: "vertex-users", label: "User Management", url: "http://192.168.0.253:12001/userlist.html", fallbackUrl: "http://vtc:12001/userlist.html" },
    ],
  },
  {
    group: "HANVIN",
    items: [
      { id: "hanvin-attendance", label: "Attendance Report", url: "http://192.168.0.253:13003", fallbackUrl: "http://vtc:13003" },
      { id: "hanvin-users", label: "User Management", url: "http://192.168.0.253:13001/userlist.html", fallbackUrl: "http://vtc:13001/userlist.html" },
    ],
  },
  {
    group: "MEN2 MANILA Dagupan",
    items: [
      { id: "men2-manila-attendance", label: "Attendance Report", url: "http://100.103.111.11:10002" },
      { id: "men2-manila-users", label: "User Management", url: "http://192.168.0.253:14001/userlist.html", fallbackUrl: "http://vtc:14001/userlist.html" },
    ],
  },
  {
    group: "CAFETERIA",
    items: [
      { id: "cafeteria-attendance", label: "Attendance Report", url: "http://192.168.0.253:15003", fallbackUrl: "http://vtc:15003" },
      { id: "cafeteria-users", label: "User Management", url: "http://192.168.0.253:15001/userlist.html", fallbackUrl: "http://vtc:15001/userlist.html" },
    ],
  },
  {
    group: "RC2",
    items: [
      { id: "rc2-attendance", label: "Attendance Report", url: "http://192.168.0.253:16003", fallbackUrl: "http://vtc:16003" },
      { id: "rc2-users", label: "User Management", url: "http://192.168.0.253:16001/userlist.html", fallbackUrl: "http://vtc:16001/userlist.html" },
    ],
  },
  {
    group: "Men2 Manufacturing",
    items: [
      { id: "manufacturing-attendance", label: "Attendance Report", url: "http://192.168.0.253:17003", fallbackUrl: "http://vtc:17003" },
      { id: "manufacturing-users", label: "User Management", url: "http://192.168.0.253:17001/userlist.html", fallbackUrl: "http://vtc:17001/userlist.html" },
    ],
  },
  {
    group: "Vital",
    items: [
      { id: "vital-attendance", label: "Attendance Report", url: "http://192.168.0.253:18003", fallbackUrl: "http://vtc:18003" },
      { id: "vital-users", label: "User Management", url: "http://192.168.0.253:18001/userlist.html", fallbackUrl: "http://vtc:18001/userlist.html" },
    ],
  },
  {
    group: "RSM",
    items: [
      { id: "rsm-attendance", label: "Attendance Report", url: "http://192.168.0.253:19003", fallbackUrl: "http://vtc:19003" },
      { id: "rsm-users", label: "User Management", url: "http://192.168.0.253:19001/userlist.html", fallbackUrl: "http://vtc:19001/userlist.html" },
      { id: "rsm-payroll", label: "Payroll System", url: "http://192.168.0.253:19004", fallbackUrl: "http://vtc:19004" },
    ]
  }
];

export function isPayrollApp(app: AppMeta | AppLink | null | undefined): boolean {
  if (!app) return false;
  if ("isPayroll" in app && app.isPayroll) return true;
  return app.id.endsWith("-payroll");
}

export type AppMeta = AppLink & { group: string };

export const APP_INDEX: Record<string, AppMeta> = Object.fromEntries(
  APP_GROUPS.flatMap((g) => g.items.flatMap((i) => {
    const entries = [[i.url, { ...i, group: g.group }]];
    if (i.fallbackUrl) {
      entries.push([i.fallbackUrl, { ...i, group: g.group }]);
    }
    return entries;
  }))
);

export const ALLOWED_URLS = new Set(Object.keys(APP_INDEX));
export const DEFAULT_URL = APP_GROUPS[0]?.items[0]?.url ?? "about:blank";

export function getAppMetaByUrl(url: string | null | undefined): AppMeta | null {
  if (!url) return null;
  return APP_INDEX[url] ?? null;
}
