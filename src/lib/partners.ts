// ─────────────────────────────────────────────────────────────────────────────
// Partner definitions — CHANGE passwords before production deployment!
// ─────────────────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;       // stable login/session id
  dbId: string;     // UUID stored in Supabase partner_id columns
  name: string;
  password: string; // plaintext — hash with bcrypt in production
  initials: string;
  color: string;    // accent color used in the UI
}

export const PARTNERS: Partner[] = [
  {
    id: "safia",
    dbId: "596c4367-1491-481f-b0f2-1825c2540ebd",
    name: "Safia",
    password: "safia2025",   // ← CHANGE THIS
    initials: "SF",
    color: "#7C3AED",
  },
  {
    id: "omaima",
    dbId: "2a304931-2230-4960-9e44-b19ed5e0178b",
    name: "Omaima",
    password: "omaima2025",  // ← CHANGE THIS
    initials: "OM",
    color: "#DB2777",
  },
  {
    id: "aisha",
    dbId: "652f4263-d4e3-4bf6-a5c4-778e8a08c710",
    name: "Aisha",
    password: "aisha2025",   // ← CHANGE THIS
    initials: "AI",
    color: "#D97706",
  },
];

export function findPartner(name: string, password: string): Partner | null {
  return (
    PARTNERS.find(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase().trim() &&
        p.password === password
    ) ?? null
  );
}

export function getPartnerById(id: string): Partner | null {
  return PARTNERS.find((p) => p.id === id || p.dbId === id) ?? null;
}

export function getPartnerDbId(id: string): string {
  return getPartnerById(id)?.dbId ?? id;
}
