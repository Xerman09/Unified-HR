export type DirectusUser = {
  user_id: number;
  user_email: string;
  user_password: string;
  user_fname?: string;
  user_mname?: string;
  user_lname?: string;
  user_department?: number | { id?: number } | null;
  is_deleted?: any;
  isDeleted?: any;
};

export type DirectusItemsResponse<T> = {
  data: T[] | T;
};

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.warn(`[Directus Config Warning]: Missing environment variable: ${name}`);
    return "";
  }
  return v;
}

export function directusBaseUrl(): string {
  return mustEnv("DIRECTUS_URL").replace(/\/$/, "");
}

export function directusToken(): string {
  return mustEnv("DIRECTUS_TOKEN");
}

export async function fetchUserByEmail(email: string): Promise<DirectusUser | null> {
  const base = directusBaseUrl();
  const token = directusToken();

  const url = new URL(`${base}/items/user`);
  url.searchParams.set("filter[user_email][_eq]", email);
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      console.warn(`Directus access denied: ${res.status}. Check your DIRECTUS_TOKEN.`);
      return null;
    }
    const text = await res.text().catch(() => "");
    throw new Error(`Directus error (${res.status}): ${text || res.statusText}`);
  }

  const json = (await res.json()) as DirectusItemsResponse<DirectusUser>;
  const data: any = json?.data;

  if (!data) return null;

  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
}

export function getDepartmentId(user: DirectusUser): number | null {
  const dep: any = user.user_department;
  if (dep == null) return null;
  if (typeof dep === "number") return dep;
  if (typeof dep === "object" && typeof dep.id === "number") return dep.id;
  return null;
}

export function isUserDeleted(user: DirectusUser): boolean {
  // This handles a few possible schemas seen in Directus exports.
  // Adjust to your exact DB field semantics if needed.
  const anyUser: any = user as any;

  if (typeof anyUser.isDeleted === "boolean") return anyUser.isDeleted;
  if (typeof anyUser.is_deleted === "boolean") return anyUser.is_deleted;

  // If stored as Buffer object: { type: 'Buffer', data: [1] }
  const buf = anyUser.is_deleted?.data;
  if (Array.isArray(buf) && buf.length > 0) return buf[0] === 1;

  return false;
}
