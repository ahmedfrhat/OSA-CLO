// ─────────────────────────────────────────────────────────────────────────────
// Partner definitions — CHANGE passwords before production deployment!
// ─────────────────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;       // used as partner_id in the database
  name: string;
  password: string; // plaintext — hash with bcrypt in production
  initials: string;
  color: string;    // accent color used in the UI
}

export const PARTNERS: Partner[] = [
  {
    id: "safia",
    name: "Safia",
    password: "safia2025",   // ← CHANGE THIS
    initials: "SF",
    color: "#7C3AED",
  },
  {
    id: "omaima",
    name: "Omaima",
    password: "omaima2025",  // ← CHANGE THIS
    initials: "OM",
    color: "#DB2777",
  },
  {
    id: "aisha",
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
  return PARTNERS.find((p) => p.id === id) ?? null;
}
