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
    group: "Men2 Dagupan",
    items: [
      { id: "men2-attendance", label: "Attendance Report", url: "http://192.168.0.253:11003", fallbackUrl: "http://vtc:11003" },
      { id: "men2-users", label: "User Management", url: "http://192.168.0.253:11001/userlist.html", fallbackUrl: "http://vtc:11001/userlist.html" },
      { id: "men2-payroll", label: "Payroll System", url: "http://192.168.0.253:9011/auth/login", fallbackUrl: "http://goatedcodoer:9011/auth/login", isPayroll: true },
    ],
  },
  {
    group: "Vertex",
    items: [
      { id: "vertex-attendance", label: "Attendance Report", url: "http://192.168.0.253:12003", fallbackUrl: "http://vtc:12003" },
      { id: "vertex-users", label: "User Management", url: "http://192.168.0.253:12001/userlist.html", fallbackUrl: "http://vtc:12001/userlist.html" },
      { id: "vertex-payroll", label: "Payroll System", url: "http://192.168.0.253:9012/auth/login", fallbackUrl: "http://vtc:9012/auth/login", isPayroll: true },
    ],
  },
  {
    group: "HANVIN",
    items: [
      { id: "hanvin-attendance", label: "Attendance Report", url: "http://192.168.0.253:13003", fallbackUrl: "http://vtc:13003" },
      { id: "hanvin-users", label: "User Management", url: "http://192.168.0.253:13001/userlist.html", fallbackUrl: "http://vtc:13001/userlist.html" },
      { id: "hanvin-payroll", label: "Payroll System", url: "http://192.168.0.253:9013/auth/login", fallbackUrl: "http://vtc:9013/auth/login", isPayroll: true },
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
  {
    group: "CAFETERIA",
    items: [
      { id: "cafeteria-attendance", label: "Attendance Report", url: "http://192.168.0.253:15003", fallbackUrl: "http://vtc:15003" },
      { id: "cafeteria-users", label: "User Management", url: "http://192.168.0.253:15001/userlist.html", fallbackUrl: "http://vtc:15001/userlist.html" },
      { id: "cafeteria-payroll", label: "Payroll System", url: "http://192.168.0.253:15004/auth/login", fallbackUrl: "http://vtc:15004/auth/login", isPayroll: true },
    ],
  },
  {
    group: "RC2",
    items: [
      { id: "rc2-attendance", label: "Attendance Report", url: "http://192.168.0.253:16003", fallbackUrl: "http://vtc:16003" },
      { id: "rc2-users", label: "User Management", url: "http://192.168.0.253:16001/userlist.html", fallbackUrl: "http://vtc:16001/userlist.html" },
      { id: "rc2-payroll", label: "Payroll System", url: "http://192.168.0.253:16004/auth/login", fallbackUrl: "http://vtc:16004/auth/login", isPayroll: true },
    ],
  },
  {
    group: "Men2 Manufacturing",
    items: [
      { id: "manufacturing-attendance", label: "Attendance Report", url: "http://192.168.0.253:17003", fallbackUrl: "http://vtc:17003" },
      { id: "manufacturing-users", label: "User Management", url: "http://192.168.0.253:17001/userlist.html", fallbackUrl: "http://vtc:17001/userlist.html" },
      { id: "manufacturing-payroll", label: "Payroll System", url: "http://192.168.0.253:17004/auth/login", fallbackUrl: "http://vtc:17004/auth/login", isPayroll: true },
    ],
  },
  {
    group: "Vital",
    items: [
      { id: "vital-attendance", label: "Attendance Report", url: "http://192.168.0.253:18003", fallbackUrl: "http://vtc:18003" },
      { id: "vital-users", label: "User Management", url: "http://192.168.0.253:18001/userlist.html", fallbackUrl: "http://vtc:18001/userlist.html" },
      { id: "vital-payroll", label: "Payroll System", url: "http://192.168.0.253:18004/auth/login", fallbackUrl: "http://vtc:18004/auth/login", isPayroll: true },
    ],
  },
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
